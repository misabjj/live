<?php

namespace App\Actions\PaymentProcessors;

use Illuminate\Support\Facades\Log;
use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\Exceptions\MPApiException;
use MercadoPago\MercadoPagoConfig;

class TestMercadoPagoConnection
{
    public function handle(string $accessToken): bool
    {
        try {
            MercadoPagoConfig::setAccessToken($accessToken);
            MercadoPagoConfig::setRuntimeEnviroment(MercadoPagoConfig::LOCAL);

            $payment = (new PaymentClient)->create([
                'transaction_amount' => 1.0,
                'description' => 'Teste de conexão',
                'payment_method_id' => 'pix',
                'payer' => [
                    'email' => 'teste@teste.com',
                    'first_name' => 'Teste',
                    'last_name' => 'Testado',
                    'identification' => [
                        'type' => 'CPF',
                        'number' => '12345678909',
                    ],
                ],
            ]);

            Log::info('MercadoPago SDK connection test successful', [
                'payment_id' => $payment->id,
            ]);

            return true;
        } catch (MPApiException $exception) {
            Log::error('MercadoPago API connection test failed', [
                'error' => $exception->getApiResponse()->getContent(),
                'status_code' => $exception->getStatusCode(),
            ]);
        } catch (\Throwable $exception) {
            Log::error('MercadoPago SDK connection test failed', [
                'error' => $exception->getMessage(),
            ]);
        }

        return false;
    }
}
