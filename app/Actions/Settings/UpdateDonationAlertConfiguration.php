<?php

namespace App\Actions\Settings;

use App\Events\Widgets\DonationAlertConfigurationUpdated;
use App\Models\DonationAlertConfiguration;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateDonationAlertConfiguration
{
    /** @param array<string, mixed> $data
     * @throws \Throwable
     */
    public function handle(User $user, array $data): void
    {
        DB::transaction(function () use ($user, $data): void {
            $configuration = DonationAlertConfiguration::updateOrCreate(['user_id' => $user->id], $data);
            broadcast(new DonationAlertConfigurationUpdated($configuration));
        });
    }
}
