<?php

namespace App\Actions\Auth;

use App\Models\User;

class SendEmailVerificationNotification
{
    public function handle(User $user): bool
    {
        if ($user->hasVerifiedEmail()) {
            return false;
        }

        $user->sendEmailVerificationNotification();

        return true;
    }
}
