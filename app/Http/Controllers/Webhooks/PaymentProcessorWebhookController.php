<?php

namespace App\Http\Controllers\Webhooks;

use App\Actions\Donations\ApproveDonation;
use App\Actions\Notifications\SendDiscordMessage;
use App\Enums\PaymentProcessor;
use App\Http\Controllers\Controller;
use App\Models\Donation;
use Efi\EfiPay;
use Illuminate\Http\Request;

class PaymentProcessorWebhookController extends Controller
{
    public function __construct(
        private readonly ApproveDonation $approveDonation,
        private readonly SendDiscordMessage $sendDiscordMessage,
    ) {}

    /**
     * @throws \Throwable
     */
    public function efiBank(Request $request, string $processor)
    {
        // STEP 1: Webhook received
        $this->sendDiscordMessage->handle([
            'step' => 1,
            'action' => 'Webhook received',
            'processor' => $processor,
            'timestamp' => now(),
        ]);

        if ($processor !== PaymentProcessor::EfiBank->value) {
            // STEP 2: Invalid processor error
            $this->sendDiscordMessage->handle([
                'step' => 2,
                'action' => 'Invalid processor',
                'received_processor' => $processor,
                'expected' => PaymentProcessor::EfiBank->value,
                'error' => 'Processor validation failed',
            ]);

            abort(404, 'not working');
        }

        $paymentProcessor = \App\Models\PaymentProcessor::where('webhook_signing_secret', $request->query('hmac'))->first();

        if (! $paymentProcessor) {
            // STEP 3: Payment processor not found error
            $this->sendDiscordMessage->handle([
                'step' => 3,
                'action' => 'Payment processor not found',
                'hmac' => $request->query('hmac'),
                'error' => 'No payment processor found with this HMAC',
            ]);

            abort(404, 'not working 2');
        }

        if ($request->input('evento') === 'teste_webhook') {
            // STEP 4: Webhook test received
            $this->sendDiscordMessage->handle([
                'step' => 4,
                'action' => 'Webhook test received',
                'evento' => $request->input('evento'),
                'message' => 'Test webhook successfully received',
            ]);

            return response()->json([
                'status' => 200,
            ]);
        }

        // STEP 5: Processing payment webhook
        $this->sendDiscordMessage->handle([
            'step' => 5,
            'action' => 'Processing payment webhook',
            'evento' => $request->input('evento'),
            'request_data' => $request->all(),
        ]);

        $paymentId = $request->json()->all('pix')[0]['txid'];

        $donation = Donation::where('payment_id', $paymentId)->first();

        if (! $donation) {
            return response()->json([
                'status' => 200,
            ]);
        }

        $tempCertificatePath = tempnam(sys_get_temp_dir(), '');

        file_put_contents($tempCertificatePath, $paymentProcessor->config->certificate_content);

        $efiPay = new EfiPay([
            'client_id' => $paymentProcessor->config->client_id,
            'client_secret' => $paymentProcessor->config->client_secret,
            'certificate' => $tempCertificatePath,
            'sandbox' => false,
            'debug' => false,
            'timeout' => 30,
        ]);

        $charge = $efiPay->pixDetailCharge([
            'txid' => $donation->payment_id,
        ]);

        if ($charge['status'] === 'CONCLUIDA') {
            $this->approveDonation->handle($donation);

            // STEP 6: Donation marked as approved
            $this->sendDiscordMessage->handle([
                'step' => 6,
                'action' => 'Donation approved',
                'donation_id' => $donation->id,
                'payment_id' => $paymentId,
                'amount' => $donation->amount,
                'status' => 'success',
            ]);

        }

        return response()->json([
            'status' => 200,
        ]);
    }
}
