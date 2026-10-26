<?php

namespace App\Actions\Auth;

use Illuminate\Support\Facades\Password;

class SendPasswordResetLink
{
    public function handle(string $email): string
    {
        return Password::sendResetLink(['email' => $email]);
    }
}
