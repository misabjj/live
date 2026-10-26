<?php

namespace App\Http\Controllers\Webhooks;

use App\Actions\Webhooks\ProcessEfiBankWebhook;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentProcessorWebhookController extends Controller
{
    public function __construct(private ProcessEfiBankWebhook $processEfiBankWebhook) {}

    /** @throws \Throwable */
    public function efiBank(Request $request, string $processor): JsonResponse
    {
        return $this->processEfiBankWebhook->handle($request, $processor);
    }
}
