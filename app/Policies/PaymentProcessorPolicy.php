<?php

namespace App\Policies;

use App\Models\PaymentProcessor;
use App\Models\User;

class PaymentProcessorPolicy
{
    public function toggleStatus(User $user, PaymentProcessor $paymentProcessor): bool
    {
        return $user->id === $paymentProcessor->user_id;
    }
}
