<?php

namespace App\Actions\Auth;

use Illuminate\Foundation\Auth\EmailVerificationRequest;

class VerifyEmail
{
    public function handle(EmailVerificationRequest $request): void
    {
        $request->fulfill();
    }
}
