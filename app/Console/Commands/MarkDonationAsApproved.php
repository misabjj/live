<?php

namespace App\Console\Commands;

use App\Actions\Donations\ApproveDonation;
use App\Models\Donation;
use Illuminate\Console\Command;

class MarkDonationAsApproved extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'donation:approve {id : The donation ID}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark a donation as approved';

    /**
     * Execute the console command.
     */
    public function handle(ApproveDonation $approveDonation): int
    {
        $donationId = $this->argument('id');

        $donation = Donation::find($donationId);

        if (! $donation) {
            $this->error("Donation with ID {$donationId} not found.");

            return self::FAILURE;
        }

        if ($donation->isNotPending()) {
            $this->error("Donation {$donationId} is not pending (current status: {$donation->status->value}).");

            return self::FAILURE;
        }

        try {
            $approveDonation->handle($donation);
            $this->info("Donation {$donationId} has been approved successfully.");

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error("Failed to approve donation: {$e->getMessage()}");

            return self::FAILURE;
        }
    }
}
