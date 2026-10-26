<?php

namespace App\Actions\Auth;

use App\Actions\Users\CreateUser;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class LoginOrRegisterWithOAuth
{
    public function __construct(private CreateUser $createUser) {}

    /** @throws \Throwable */
    public function handle(string $provider, string $providerId, string $name, string $email, ?string $avatar, ?string $token): User
    {
        return DB::transaction(function () use ($provider, $providerId, $name, $email, $avatar, $token): User {
            $user = User::where('email', $email)
                ->orWhere(fn ($query) => $query->where('provider_name', $provider)->where('provider_id', $providerId))
                ->first();

            if ($user) {
                $user->update([
                    'provider_name' => $provider,
                    'provider_id' => $providerId,
                    'profile_photo' => $avatar,
                    'provider_token' => $token,
                ]);

                return $user;
            }

            return $this->createUser->handle(
                displayName: $name,
                email: $email,
                emailVerifiedAt: now(),
                providerName: $provider,
                providerId: $providerId,
                profilePhoto: $avatar,
                providerToken: $token,
            );
        });
    }
}
