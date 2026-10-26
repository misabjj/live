<?php

namespace App\Console\Commands;

use App\Actions\Donations\ApproveDonation;
use App\Actions\Donations\ExpireDonation;
use App\Models\Donation;
use App\Support\EfiCertificate;
use Efi\EfiPay;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;

class CheckExpiredDonations extends Command
{
    protected $signature = 'donations:check-expired';

    protected $description = 'Check overdue pending donations and update their status based on payment processor';

    public function handle(ApproveDonation $approveDonation, ExpireDonation $expireDonation): int
    {
        $totalCount = Donation::pending()
            ->overdue()
            ->count();

        if ($totalCount === 0) {
            $this->info('No overdue donations found.');

            return self::SUCCESS;
        }

        $this->info("Found {$totalCount} overdue donation(s). Checking payment status...");

        $approved = 0;
        $expired = 0;
        $errors = 0;

        Donation::pending()
            ->overdue()
            ->with('streamer.paymentProcessors')
            ->chunkById(100, function (Collection $donations) use (
                $approveDonation,
                $expireDonation,
                &$approved,
                &$expired,
                &$errors,
            ): void {
                /** @var Donation $donation */
                foreach ($donations as $donation) {
                    try {
                        $paymentProcessor = $donation->streamer
                            ->paymentProcessors()
                            ->efiBank()
                            ->first();

                        if (! $paymentProcessor) {
                            $this->warn("No active payment processor for donation {$donation->id}");
                            $errors++;

                            continue;
                        }

                        $efiPay = new EfiPay([
                            'client_id' => $paymentProcessor->config->client_id,
                            'client_secret' => $paymentProcessor->config->client_secret,
                            'certificate' => EfiCertificate::fromConfig($paymentProcessor->config),
                            'sandbox' => false,
                            'debug' => false,
                            'timeout' => 30,
                        ]);

                        $charge = $efiPay->pixDetailCharge([
                            'txid' => $donation->payment_id,
                        ]);

                        if ($charge['status'] === 'CONCLUIDA') {
                            $approveDonation->handle($donation);
                            $this->info("Donation {$donation->id} marked as approved.");
                            $approved++;
                        } else {
                            $expireDonation->handle($donation);
                            $this->info("Donation {$donation->id} marked as expired.");
                            $expired++;
                        }
                    } catch (Exception $e) {
                        $this->error("Error processing donation {$donation->id}: {$e->getMessage()}");
                        $errors++;
                    }
                }
            });

        $this->newLine();
        $this->info('Processing complete:');
        $this->info("  - Approved: {$approved}");
        $this->info("  - Expired: {$expired}");
        $this->info("  - Errors: {$errors}");

        return self::SUCCESS;
    }
}
