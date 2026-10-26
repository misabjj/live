<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Http\Request;

class AuthenticatedUser
{
    public function __construct(private readonly Request $request) {}

    public function get(): User
    {
        $user = $this->request->user();

        abort_unless($user instanceof User, 401);

        return $user;
    }
}
