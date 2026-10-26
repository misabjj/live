<?php

namespace App\Actions\Webhooks;

use App\Actions\Donations\ApproveDonation;
use App\Actions\Notifications\SendDiscordMessage;
use App\Enums\PaymentProcessor;
use App\Models\Donation;
use App\Models\PaymentProcessor as PaymentProcessorModel;
use App\Support\EfiCertificate;
use Efi\EfiPay;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProcessEfiBankWebhook
{
    public function __construct(
        private ApproveDonation $approveDonation,
        private SendDiscordMessage $sendDiscordMessage,
    ) {}

    /** @throws \Throwable */
    public function handle(Request $request, string $processor): JsonResponse
    {
        $this->sendDiscordMessage->handle([
            'step' => 1,
            'action' => 'Webhook received',
            'processor' => $processor,
            'timestamp' => now(),
        ]);

        if ($processor !== PaymentProcessor::EfiBank->value) {
            $this->sendDiscordMessage->handle([
                'step' => 2,
                'action' => 'Invalid processor',
                'received_processor' => $processor,
                'expected' => PaymentProcessor::EfiBank->value,
                'error' => 'Processor validation failed',
            ]);

            abort(404, 'not working');
        }

        $paymentProcessor = PaymentProcessorModel::where('webhook_signing_secret', $request->query('hmac'))->first();

        if (! $paymentProcessor) {
            $this->sendDiscordMessage->handle([
                'step' => 3,
                'action' => 'Payment processor not found',
                'hmac' => $request->query('hmac'),
                'error' => 'No payment processor found with this HMAC',
            ]);

            abort(404, 'not working 2');
        }

        if ($request->input('evento') === 'teste_webhook') {
            $this->sendDiscordMessage->handle([
                'step' => 4,
                'action' => 'Webhook test received',
                'evento' => $request->input('evento'),
                'message' => 'Test webhook successfully received',
            ]);

            return response()->json(['status' => 200]);
        }

        $this->sendDiscordMessage->handle([
            'step' => 5,
            'action' => 'Processing payment webhook',
            'evento' => $request->input('evento'),
            'request_data' => $request->all(),
        ]);

        $paymentId = $request->json()->all('pix')[0]['txid'];
        $donation = Donation::where('payment_id', $paymentId)->first();

        if (! $donation) {
            return response()->json(['status' => 200]);
        }

        $efiPay = new EfiPay([
            'client_id' => $paymentProcessor->config->client_id,
            'client_secret' => $paymentProcessor->config->client_secret,
            'certificate' => EfiCertificate::fromConfig($paymentProcessor->config),
            'sandbox' => false,
            'debug' => false,
            'timeout' => 30,
        ]);
        $charge = $efiPay->pixDetailCharge(['txid' => $donation->payment_id]);

        if ($charge['status'] === 'CONCLUIDA') {
            $this->approveDonation->handle($donation);
            $this->sendDiscordMessage->handle([
                'step' => 6,
                'action' => 'Donation approved',
                'donation_id' => $donation->id,
                'payment_id' => $paymentId,
                'amount' => $donation->amount,
                'status' => 'success',
            ]);
        }

        return response()->json(['status' => 200]);
    }
}
