<?php

namespace App\Actions\Settings;

use App\Events\Widgets\ProfileQrCodeUpdated;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class UpdateProfile
{
    /** @throws \Throwable */
    /** @param array<string, mixed> $data */
    public function handle(User $user, array $data, ?UploadedFile $backgroundImage): void
    {
        DB::transaction(function () use ($user, $data, $backgroundImage): void {
            $oldHandle = $user->handle;
            $user->update([
                'display_name' => $data['display_name'],
                'handle' => $data['handle'],
                'background_image' => $backgroundImage?->store('background-images', 'public') ?? $user->background_image,
                'background_color' => $data['background_color'] ?? null,
            ]);

            if ($oldHandle !== $user->handle) {
                broadcast(new ProfileQrCodeUpdated($user->profileQrCode));
            }
        });
    }
}
