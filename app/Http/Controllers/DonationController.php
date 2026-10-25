<?php

namespace App\Http\Controllers;

use App\Actions\Donations\BroadcastDonationAlert;
use App\Enums\DonationContentType;
use App\Enums\DonationCurrency;
use App\Enums\PaymentMethod;
use App\Enums\PaymentProcessor;
use App\Http\Requests\StoreDonationRequest;
use App\Models\Donation;
use App\Models\User;
use App\Support\BrowserFingerprint;
use App\Support\EfiCertificate;
use App\Support\Toast;
use Efi\EfiPay;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class DonationController extends Controller
{
    public function index(Request $request)
    {
        $donations = QueryBuilder::for(auth()->user()->donations()->approved())
            ->allowedFilters(AllowedFilter::partial('donor_name'))
            ->defaultSort('-created_at')
            ->paginate()
            ->withQueryString()
            ->through(fn (Donation $donation) => [
                'id' => $donation->id,
                'donor_name' => $donation->donor_name,
                'amount' => $donation->amount,
                'currency' => $donation->currency->value,
                'created_at' => $donation->created_at,
                'content_type' => $donation->content_type->value,
                'content_text' => $donation->content_text,
                'content_path' => $donation->getContentUrl(),
            ]);

        return inertia('donations/index', [
            'donations' => $donations,
            'filter' => [
                'donor_name' => $request->query('filter.donor_name', ''),
            ],
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function store(StoreDonationRequest $request, User $streamer)
    {
        if (! $streamer->accepting_donations) {
            return back()->with('error', 'Streamer não está aceitando doações!');
        }

        // Try to get an active PIX processor (EFI Bank or MercadoPago)
        $paymentProcessor = $streamer->paymentProcessors()->active()
            ->where(function ($query) {
                $query->where('processor', PaymentProcessor::EfiBank)
                    ->orWhere('processor', PaymentProcessor::MercadoPago);
            })
            ->first();

        if (! $paymentProcessor) {
            return back()->with('error', 'Não há processador de pagamento PIX ativo!');
        }

        $expiresAt = now()->addMinutes(30);
        $paymentResponse = null;
        $splitId = null;

        // Process payment based on the processor type
        if ($paymentProcessor->isEfiBank()) {
            $tempCertificatePath = EfiCertificate::writeTemporaryPem(
                $paymentProcessor->config->certificate_content,
            );

            try {
                $efiPay = new EfiPay([
                    'client_id' => $paymentProcessor->config->client_id,
                    'client_secret' => $paymentProcessor->config->client_secret,
                    'certificate' => $tempCertificatePath,
                    'sandbox' => false,
                    'debug' => false,
                    'timeout' => 30,
                ]);

                $platformPercentage = config('platform.fee_percentage');
                $streamerPercentage = 100 - $platformPercentage;

                $shouldSplit = false;

                if ($shouldSplit) {
                    $split = $efiPay->pixSplitConfig([], [
                        'lancamento' => [
                            'imediato' => true,
                        ],
                        'split' => [
                            'divisaoTarifa' => 'assumir_total',
                            'minhaParte' => [
                                'tipo' => 'porcentagem',
                                'valor' => number_format($streamerPercentage, 2, '.', ''),
                            ],
                            'repasses' => [
                                [
                                    'tipo' => 'porcentagem',
                                    'valor' => number_format($platformPercentage, 2, '.', ''),
                                    'favorecido' => [
                                        'cpf' => config('platform.efi_document_number'),
                                        'conta' => config('platform.efi_account_number'),
                                    ],
                                ],
                            ],
                        ],
                    ]);
                }

                $charge = $efiPay->pixCreateImmediateCharge([], [
                    'calendario' => [
                        'expiracao' => (int) now()->diffInSeconds($expiresAt, false),
                    ],
                    'valor' => [
                        'original' => number_format($request->amount, 2, '.', ''),
                    ],
                    'chave' => $paymentProcessor->config->pix_key,
                ]);

                if ($shouldSplit) {
                    $efiPay->pixSplitLinkCharge([
                        'txid' => $charge['txid'],
                        'splitConfigId' => $split['id'],
                    ]);
                }

                $paymentResponse = [
                    'payment_id' => $charge['txid'],
                    'payment_reference' => $charge['pixCopiaECola'],
                ];

                if ($shouldSplit) {
                    $splitId = $split['id'];
                }
            } finally {
                EfiCertificate::deleteTemporary($tempCertificatePath);
            }

        } else {
            return back()->with('error', 'Processador de pagamento não suportado!');
        }

        if (! $paymentResponse) {
            return back()->with('error', 'Erro ao criar o pagamento!');
        }

        $donationData = [
            'streamer_id' => $streamer->id,
            'goal_id' => $streamer->goals()->active()->value('id'),
            'donor_ip_address' => $request->ip(),
            'donor_name' => preg_replace('/\s+/', ' ', trim($request->donor_name)),
            'donor_browser_fingerprint' => BrowserFingerprint::getFingerprint(),
            'donor_id' => auth()->id(),
            'currency' => DonationCurrency::Brl,
            'amount' => $request->amount,
            'content_type' => $request->content_type,
            'expires_at' => $expiresAt,
            'payment_id' => $paymentResponse['payment_id'],
            'payment_reference' => $paymentResponse['payment_reference'],
            'payment_split_id' => $splitId,
            'payment_processor' => $paymentProcessor->processor,
            'payment_method' => PaymentMethod::Pix,
        ];

        $donation = new Donation($donationData);
        $donation->id = strtolower(Str::ulid()->toString());

        if ($request->content_type === DonationContentType::TextToSpeech->value) {
            $donation->content_text = $request->content_text;
            $donation->narrator_id = $request->narrator_id;
        } elseif ($request->content_type === DonationContentType::Text->value) {
            $donation->content_text = $request->content_text;
        } elseif ($request->content_type === DonationContentType::Audio->value && $request->hasFile('audio_file')) {
            $extension = $request->file('audio_file')->getClientOriginalExtension();
            $filename = $donation->id.'-'.time().'.'.$extension;
            $path = "donations/{$filename}";

            Storage::disk('public')->put($path, $request->file('audio_file')->get());

            $donation->content_path = $path;
        }

        $donation->save();

        return to_route('donations.show', $donation);
    }

    public function show(Donation $donation)
    {
        if ($donation->isPending()) {
            return inertia('donations/pending', [
                'donation' => [
                    'id' => $donation->id,
                    'donor_name' => $donation->donor_name,
                    'amount' => $donation->amount,
                    'content_type' => $donation->content_type,
                    'currency' => $donation->currency->value,
                    'status' => $donation->status->value,
                    'payment_reference' => $donation->payment_reference,
                    'payment_method' => $donation->payment_method,
                    'expires_at' => max(0, now()->diffInSeconds($donation->expires_at)),
                    'streamer' => [
                        'id' => $donation->streamer->id,
                        'name' => $donation->streamer->display_name,
                        'handle' => $donation->streamer->handle,
                        'avatar' => $donation->streamer->getProfilePhotoUrl(),
                        'background_image' => $donation->streamer->background_image,
                    ],
                ],
            ]);
        }

        if ($donation->isApproved()) {
            return inertia('donations/approved', [
                'donation' => [
                    'id' => $donation->id,
                    'streamer' => [
                        'display_name' => $donation->streamer->display_name,
                        'handle' => $donation->streamer->handle,
                        'profile_photo' => $donation->streamer->getProfilePhotoUrl(),
                    ],
                ],
            ]);
        }

        if ($donation->isExpired()) {
            return inertia('donations/expired', [
                'donation' => [
                    'id' => $donation->id,
                    'streamer' => [
                        'display_name' => $donation->streamer->display_name,
                        'handle' => $donation->streamer->handle,
                        'profile_photo' => $donation->streamer->getProfilePhotoUrl(),
                    ],
                ],
            ]);
        }

        abort(500);
    }

    /**
     * @throws \Throwable
     */
    public function playDonationAlert(Donation $donation, BroadcastDonationAlert $broadcastDonationAlert)
    {
        $this->authorize('update', $donation);

        $user = auth()->user();

        if (! $user->queue_paused) {
            $broadcastDonationAlert->handle($donation);
            Toast::success('Alerta será reproduzido em breve!');
        } else {
            if (! $donation->in_queue) {
                $donation->update(['in_queue' => true]);
            }
            Toast::success('Adicionado à fila de alertas!');
        }

        return back();
    }

    public function blockDonor(Donation $donation)
    {
        $donorName = $donation->donor_name;

        try {
            // This will soft delete the donation, effectively blocking the donor's message
            $donation->delete();

            Toast::warning("Donor '{$donorName}' has been blocked and their message removed.");
        } catch (Exception $e) {
            Toast::error('Failed to block donor. Please try again.');
        }

        return back();
    }
}
