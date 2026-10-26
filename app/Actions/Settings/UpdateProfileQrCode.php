<?php

namespace App\Actions\Settings;

use App\Events\Widgets\ProfileQrCodeUpdated;
use App\Models\ProfileQrCode;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateProfileQrCode
{
    /** @param array<string, mixed> $data
     * @throws \Throwable
     */
    public function handle(User $user, array $data): void
    {
        DB::transaction(function () use ($user, $data): void {
            $profileQrCode = ProfileQrCode::updateOrCreate(['user_id' => $user->id], $data);
            broadcast(new ProfileQrCodeUpdated($profileQrCode));
        });
    }
}
