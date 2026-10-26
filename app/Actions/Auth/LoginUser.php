<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class LoginUser
{
    public function handle(User $user): void
    {
        Auth::login($user);
    }
}
