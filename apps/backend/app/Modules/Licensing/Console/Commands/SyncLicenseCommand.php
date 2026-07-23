<?php

namespace App\Modules\Licensing\Console\Commands;

use App\Modules\Licensing\Contracts\LicensingServiceInterface;
use Illuminate\Console\Command;

class SyncLicenseCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'licensing:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronize license status and feature flags with PremierByte licensing server';

    /**
     * Execute the console command.
     */
    public function handle(LicensingServiceInterface $licensingService): int
    {
        $this->info('Starting PremierByte license synchronization...');

        $status = $licensingService->sync();

        if ($status->valid) {
            $this->info("License synchronization successful. Status: {$status->status}.");

            return Command::SUCCESS;
        }

        $this->warn("License synchronization returned invalid status: {$status->status}. Application in restricted mode.");

        return Command::FAILURE;
    }
}
