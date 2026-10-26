<?php

namespace App\Actions\Donations;

use App\Enums\DonationContentType;
use App\Enums\DonationCurrency;
use App\Enums\PaymentMethod;
use App\Enums\PaymentProcessor as PaymentProcessorType;
use App\Exceptions\DonationUnavailable;
use App\Http\Requests\StoreDonationRequest;
use App\Models\Donation;
use App\Models\User;
use App\Support\BrowserFingerprint;
use App\Support\EfiCertificate;
use Efi\EfiPay;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CreateDonation
{
    /** @throws \Throwable */
    public function handle(StoreDonationRequest $request, User $streamer): Donation
    {
        if (! $streamer->accepting_donations) {
            throw new DonationUnavailable('Streamer não está aceitando doações!');
        }

        $paymentProcessor = $streamer->paymentProcessors()->active()
            ->whereIn('processor', [PaymentProcessorType::EfiBank, PaymentProcessorType::MercadoPago])
            ->first();

        if (! $paymentProcessor) {
            throw new DonationUnavailable('Não há processador de pagamento PIX ativo!');
        }

        if (! $paymentProcessor->isEfiBank()) {
            throw new DonationUnavailable('Processador de pagamento não suportado!');
        }

        $expiresAt = now()->addMinutes(30);
        $efiPay = new EfiPay([
            'client_id' => $paymentProcessor->config->client_id,
            'client_secret' => $paymentProcessor->config->client_secret,
            'certificate' => EfiCertificate::fromConfig($paymentProcessor->config),
            'sandbox' => false,
            'debug' => false,
            'timeout' => 30,
        ]);

        $charge = $efiPay->pixCreateImmediateCharge([], [
            'calendario' => ['expiracao' => (int) now()->diffInSeconds($expiresAt, false)],
            'valor' => ['original' => number_format($request->amount, 2, '.', '')],
            'chave' => $paymentProcessor->config->pix_key,
        ]);

        $donation = new Donation([
            'streamer_id' => $streamer->id,
            'goal_id' => $streamer->goals()->active()->value('id'),
            'donor_ip_address' => $request->ip(),
            'donor_name' => preg_replace('/\s+/', ' ', trim($request->donor_name)),
            'donor_browser_fingerprint' => BrowserFingerprint::getFingerprint(),
            'donor_id' => $request->user()?->getAuthIdentifier(),
            'currency' => DonationCurrency::Brl,
            'amount' => $request->amount,
            'content_type' => $request->content_type,
            'expires_at' => $expiresAt,
            'payment_id' => $charge['txid'],
            'payment_reference' => $charge['pixCopiaECola'],
            'payment_split_id' => null,
            'payment_processor' => $paymentProcessor->processor,
            'payment_method' => PaymentMethod::Pix,
        ]);
        $donation->id = strtolower(Str::ulid()->toString());

        if ($request->content_type === DonationContentType::Text->value) {
            $donation->content_text = $request->content_text;
        } elseif ($request->content_type === DonationContentType::Audio->value && $request->hasFile('audio_file')) {
            $audio = $request->file('audio_file');
            $contents = $audio->get();

            if ($contents === false) {
                throw new DonationUnavailable('Não foi possível ler o arquivo de áudio.');
            }

            $path = 'donations/'.$donation->id.'-'.time().'.'.$audio->getClientOriginalExtension();
            Storage::disk('public')->put($path, $contents);
            $donation->content_path = $path;
        }

        $donation->save();

        return $donation;
    }
}
