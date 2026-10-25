<?php

namespace App\Http\Controllers\Settings;

use App\Actions\PaymentProcessors\TestMercadoPagoConnection;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StorePaymentProcessorRequest;
use App\Models\PaymentProcessor;
use App\Support\EfiCertificate;
use App\Support\Toast;
use Efi\EfiPay;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use MercadoPago\Client\User\UserClient;
use MercadoPago\MercadoPagoConfig;
use Throwable;

class PaymentProcessorController extends Controller
{
    public function show(): Response
    {
        $processors = auth()->user()->paymentProcessors()->get()->keyBy('processor.value');

        return Inertia::render('settings/payment-processors', [
            'processors' => [
                'stripe' => $processors->get('stripe') ? [
                    'is_active' => $processors->get('stripe')->is_active,
                ] : null,
                'efi_bank' => $processors->get('efi_bank') ? [
                    'is_active' => $processors->get('efi_bank')->is_active,
                ] : null,
                'mercado_pago' => $processors->get('mercado_pago') ? [
                    'is_active' => $processors->get('mercado_pago')->is_active,
                ] : null,
            ],
        ]);
    }

    /**
     * @throws \Exception
     * @throws Throwable
     */
    public function store(StorePaymentProcessorRequest $request, TestMercadoPagoConnection $testMercadoPagoConnection)
    {
        $processorType = $request->input('processor');

        if ($processorType === 'efi_bank') {
            return $this->storeEfiBank($request);
        } elseif ($processorType === 'mercado_pago') {
            return $this->storeMercadoPago($request, $testMercadoPagoConnection);
        }

        throw new \Exception('Unsupported processor type');
    }

    private function storeEfiBank(StorePaymentProcessorRequest $request)
    {
        $tempCertificatePath = null;

        try {
            $certificate = $request->file('certificate');

            if (! $certificate) {
                throw ValidationException::withMessages([
                    'certificate' => 'O certificado EFI é obrigatório.',
                ]);
            }

            $certificateContent = EfiCertificate::pemFromP12($certificate->getContent());
            $tempCertificatePath = EfiCertificate::writeTemporaryPem($certificateContent);

            $efiPay = new EfiPay([
                'client_id' => $request->input('client_id'),
                'client_secret' => $request->input('client_secret'),
                'certificate' => $tempCertificatePath,
                'sandbox' => false,
                'debug' => false,
                'timeout' => 30,
                'headers' => [
                    'x-skip-mtls-checking' => 'true',
                ],
            ]);

            $pixKeys = $efiPay->pixListEvp()['chaves'];
            $pixKey = $pixKeys[0] ?? $efiPay->pixCreateEvp();

            $paymentProcessor = PaymentProcessor::updateOrCreate([
                'processor' => $request->input('processor'),
                'user_id' => auth()->id(),
            ], [
                'webhook_signing_secret' => Str::uuid()->toString(),
                'is_active' => false,
                'config' => [
                    'pix_key' => $pixKey,
                    'client_id' => $request->input('client_id'),
                    'client_secret' => $request->input('client_secret'),
                    'certificate_content' => $certificateContent,
                ],
            ]);

            if (app()->environment(['production', 'staging'])) {
                $webhookUrl = route('webhook.payment-processors', \App\Enums\PaymentProcessor::EfiBank->value);
                $webhookUrl .= '?hmac='.$paymentProcessor->webhook_signing_secret;
                $webhookUrl .= '&ignorar=';

                $efiPay->pixConfigWebhook([
                    'chave' => $pixKey,
                ], [
                    'webhookUrl' => $webhookUrl,
                ]);
            }

            DB::transaction(function () use ($paymentProcessor): void {
                $paymentProcessor->update(['is_active' => true]);
                auth()->user()->update(['accepting_donations' => true]);
            });

            Toast::success('EFI Bank configurado com sucesso!');

            return back();
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            $message = match ($exception->getMessage()) {
                'Invalid or inactive credentials' => 'Inválido ou credenciais inativas!',
                'Certificate is deactivated' => 'O certificado está desativado!',
                default => 'Assista ao tutorial de como configurar o seu EFI.',
            };

            report($exception);
            Toast::error($message);

            return back();
        } finally {
            EfiCertificate::deleteTemporary($tempCertificatePath);
        }
    }

    private function storeMercadoPago(
        StorePaymentProcessorRequest $request,
        TestMercadoPagoConnection $testMercadoPagoConnection,
    ) {
        try {
            // Configure MercadoPago SDK with access token
            MercadoPagoConfig::setAccessToken($request->input('access_token'));

            // Get user information to validate the access token and retrieve user_id
            $userClient = new UserClient;
            $userInfo = $userClient->get();

            if (! $testMercadoPagoConnection->handle($request->input('access_token'))) {
                throw new \Exception('Falha ao conectar com a API do Mercado Pago');
            }

            // Create or update payment processor
            $paymentProcessor = PaymentProcessor::updateOrCreate([
                'processor' => $request->input('processor'),
                'user_id' => auth()->id(),
            ], [
                'webhook_signing_secret' => Str::uuid()->toString(),
                'is_active' => false,
                'config' => [
                    'access_token' => $request->input('access_token'),
                    'user_id' => (string) $userInfo->id,
                    'application_id' => $userInfo->application_id ?? null,
                    'platform_fee_percentage' => $request->input('platform_fee_percentage', 3.0),
                ],
            ]);

            $paymentProcessor->update([
                'is_active' => true,
            ]);

            Toast::success('Mercado Pago configurado com sucesso!');

            return back();

        } catch (\Exception $e) {
            Toast::error('Erro ao configurar Mercado Pago: '.$e->getMessage());

            return back();
        }
    }

    /**
     * @throws Throwable
     */
    public function toggleStatus(string $processor)
    {
        $user = auth()->user();

        $paymentProcessor = $user->paymentProcessors()->where('processor', $processor)->firstOrFail();

        DB::transaction(function () use ($paymentProcessor, $user) {
            $paymentProcessor->update([
                'is_active' => ! $paymentProcessor->is_active,
            ]);

            $user->update([
                'accepting_donations' => $user->paymentProcessors()->active()->exists(),
            ]);
        });

        Toast::success(
            $paymentProcessor->is_active ? 'Ativo com sucesso!' : 'Desativado com sucesso!'
        );

        return back();
    }
}
