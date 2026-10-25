<?php

namespace App\Console\Commands;

use App\Models\Donation;
use Illuminate\Console\Command;

class GetPendingDonations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'donations:pending';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get all pending donation IDs';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $pendingDonations = Donation::pending()->get(['id', 'donor_name', 'amount', 'currency']);

        if ($pendingDonations->isEmpty()) {
            $this->info('No pending donations found.');

            return self::SUCCESS;
        }

        $this->table(
            ['ID', 'Donor Name', 'Amount', 'Currency'],
            $pendingDonations->map(fn ($donation) => [
                $donation->id,
                $donation->donor_name,
                $donation->amount,
                $donation->currency->value,
            ])
        );

        $this->info("Total pending donations: {$pendingDonations->count()}");

        return self::SUCCESS;
    }
}
