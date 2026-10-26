<?php

namespace App\Actions\Settings;

use App\Models\PaymentProcessor;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TogglePaymentProcessor
{
    /** @throws \Throwable */
    public function handle(User $user, string $processor): PaymentProcessor
    {
        $paymentProcessor = $user->paymentProcessors()->where('processor', $processor)->firstOrFail();

        DB::transaction(function () use ($paymentProcessor, $user): void {
            $paymentProcessor->update(['is_active' => ! $paymentProcessor->is_active]);
            $user->update(['accepting_donations' => $user->paymentProcessors()->active()->exists()]);
        });

        return $paymentProcessor;
    }
}
