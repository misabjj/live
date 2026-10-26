<?php

namespace App\Actions\Settings;

use App\Models\User;
use Illuminate\Support\Facades\Storage;

class DeleteBackgroundImage
{
    public function handle(User $user): void
    {
        if (! $user->background_image) {
            return;
        }

        Storage::disk('public')->delete($user->background_image);
        $user->update(['background_image' => null]);
    }
}
