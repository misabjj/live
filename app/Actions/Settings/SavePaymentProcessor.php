<?php

namespace App\Actions\Settings;

use App\Actions\PaymentProcessors\TestMercadoPagoConnection;
use App\Enums\PaymentProcessor as PaymentProcessorType;
use App\Http\Requests\Settings\StorePaymentProcessorRequest;
use App\Models\PaymentProcessor;
use App\Models\User;
use Efi\EfiPay;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use MercadoPago\Client\User\UserClient;
use MercadoPago\MercadoPagoConfig;
use Throwable;

class SavePaymentProcessor
{
    /** @return array{success: bool, message: string}
     * @throws ValidationException
     */
    public function handle(StorePaymentProcessorRequest $request, User $user, TestMercadoPagoConnection $testMercadoPagoConnection): array
    {
        if ($request->input('processor') === PaymentProcessorType::EfiBank->value) {
            return $this->saveEfiBank($request, $user);
        }

        if ($request->input('processor') === PaymentProcessorType::MercadoPago->value) {
            return $this->saveMercadoPago($request, $user, $testMercadoPagoConnection);
        }

        throw new \InvalidArgumentException('Unsupported processor type');
    }

    /** @return array{success: bool, message: string}
     * @throws ValidationException
     */
    private function saveEfiBank(StorePaymentProcessorRequest $request, User $user): array
    {
        try {
            $certificate = $request->file('certificate');

            if (! $certificate) {
                throw ValidationException::withMessages(['certificate' => 'O certificado EFI é obrigatório.']);
            }

            $certificateBase64 = base64_encode($certificate->getContent());
            $efiPay = new EfiPay([
                'client_id' => $request->input('client_id'),
                'client_secret' => $request->input('client_secret'),
                'certificate' => $certificateBase64,
                'sandbox' => false,
                'debug' => false,
                'timeout' => 30,
                'headers' => ['x-skip-mtls-checking' => 'true'],
            ]);

            $pixKeys = $efiPay->pixListEvp()['chaves'];
            $pixKey = $pixKeys[0] ?? $efiPay->pixCreateEvp();
            $paymentProcessor = PaymentProcessor::updateOrCreate([
                'processor' => $request->input('processor'),
                'user_id' => $user->id,
            ], [
                'webhook_signing_secret' => Str::uuid()->toString(),
                'is_active' => false,
                'config' => [
                    'pix_key' => $pixKey,
                    'client_id' => $request->input('client_id'),
                    'client_secret' => $request->input('client_secret'),
                    'certificate_base64' => $certificateBase64,
                ],
            ]);

            if (app()->environment(['production', 'staging'])) {
                $webhookUrl = route('webhook.payment-processors', PaymentProcessorType::EfiBank->value);
                $webhookUrl .= '?hmac='.$paymentProcessor->webhook_signing_secret.'&ignorar=';
                $efiPay->pixConfigWebhook(['chave' => $pixKey], ['webhookUrl' => $webhookUrl]);
            }

            DB::transaction(function () use ($paymentProcessor, $user): void {
                $paymentProcessor->update(['is_active' => true]);
                $user->update(['accepting_donations' => true]);
            });

            return ['success' => true, 'message' => __('toasts.efi_bank_configured')];
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            $message = match ($exception->getMessage()) {
                'Invalid or inactive credentials' => __('toasts.efi_bank_credentials_invalid'),
                'Certificate is deactivated' => __('toasts.efi_bank_certificate_disabled'),
                default => __('toasts.efi_bank_configuration_failed'),
            };

            report($exception);

            return ['success' => false, 'message' => $message];
        }
    }

    /** @return array{success: bool, message: string} */
    private function saveMercadoPago(StorePaymentProcessorRequest $request, User $user, TestMercadoPagoConnection $testMercadoPagoConnection): array
    {
        try {
            MercadoPagoConfig::setAccessToken($request->input('access_token'));
            $userInfo = (new UserClient)->get();

            if (! $testMercadoPagoConnection->handle($request->input('access_token'))) {
                return ['success' => false, 'message' => __('toasts.mercado_pago_connection_failed')];
            }

            $paymentProcessor = PaymentProcessor::updateOrCreate([
                'processor' => $request->input('processor'),
                'user_id' => $user->id,
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
            $paymentProcessor->update(['is_active' => true]);

            return ['success' => true, 'message' => __('toasts.mercado_pago_configured')];
        } catch (\Exception $exception) {
            report($exception);

            return ['success' => false, 'message' => __('toasts.mercado_pago_configuration_failed')];
        }
    }
}
