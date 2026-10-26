<?php

namespace App\Actions\Settings;

use App\Models\User;
use App\Support\Str;
use Illuminate\Support\Facades\Storage;

class DeleteProfilePhoto
{
    public function handle(User $user): void
    {
        if (! $user->profile_photo) {
            return;
        }

        if (! Str::containsHttps($user->profile_photo)) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        $user->update(['profile_photo' => null]);
    }
}
