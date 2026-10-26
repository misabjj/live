<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset as PasswordResetEvent;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class ResetPassword
{
    /** @param array<string, mixed> $data */
    public function handle(array $data): string
    {
        return Password::reset($data, function (User $user) use ($data): void {
            $user->forceFill([
                'password' => $data['password'],
                'remember_token' => Str::random(60),
            ])->save();

            event(new PasswordResetEvent($user));
        });
    }
}
