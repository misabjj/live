<?php

namespace App\Actions\Users;

use App\Enums\WidgetType;
use App\Models\User;
use App\Models\Widget;
use Illuminate\Support\Facades\DB;

class CreateUser
{
    /**
     * @throws \Throwable
     */
    public function handle(
        string $displayName,
        string $email,
        ?string $password = null,
        ?string $handle = null,
        ?string $emailVerifiedAt = null,
        ?string $providerName = null,
        ?string $providerId = null,
        ?string $profilePhoto = null,
        ?string $providerToken = null,
    ): User {
        return DB::transaction(function () use (
            $displayName,
            $email,
            $password,
            $handle,
            $emailVerifiedAt,
            $providerName,
            $providerId,
            $profilePhoto,
            $providerToken,
        ): User {
            $handle ??= $this->generateUniqueHandle($displayName);

            $user = User::create([
                'display_name' => $displayName,
                'email' => $email,
                'password' => $password,
                'handle' => $handle,
                'email_verified_at' => $emailVerifiedAt,
                'provider_name' => $providerName,
                'provider_id' => $providerId,
                'profile_photo' => $profilePhoto,
                'provider_token' => $providerToken,
            ]);

            foreach (WidgetType::cases() as $type) {
                Widget::create([
                    'user_id' => $user->id,
                    'type' => $type,
                ]);
            }

            return $user;
        });
    }

    private function generateUniqueHandle(string $displayName): string
    {
        $baseHandle = $this->sanitizeHandle($displayName);
        $handle = $baseHandle;
        $counter = 1;

        while (User::where('handle', $handle)->exists()) {
            $handle = "{$baseHandle}{$counter}";
            $counter++;
        }

        return $handle;
    }

    private function sanitizeHandle(string $displayName): string
    {
        return strtolower(
            (string) preg_replace('/[^a-z0-9_-]/i', '', str_replace(' ', '_', trim($displayName)))
        ) ?: 'user';
    }
}
