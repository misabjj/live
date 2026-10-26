<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Contracts\Session\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ConfirmPassword
{
    /** @throws ValidationException */
    public function handle(User $user, string $password, Session $session): void
    {
        if (! Auth::guard('web')->validate(['email' => $user->email, 'password' => $password])) {
            throw ValidationException::withMessages(['password' => __('auth.password')]);
        }

        $session->put('auth.password_confirmed_at', time());
    }
}
