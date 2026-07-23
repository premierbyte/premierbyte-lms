<?php

namespace App\Modules\Licensing\Providers;

use App\Modules\Licensing\Contracts\LicensingServiceInterface;
use App\Modules\Licensing\Services\LicensingService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class LicensingServiceProvider extends ServiceProvider
{
    /**
     * Register licensing services in the container.
     */
    public function register(): void
    {
        $this->app->singleton(LicensingServiceInterface::class, function ($app) {
            return new LicensingService;
        });
    }

    /**
     * Bootstrap licensing services and feature flags gates.
     */
    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                \App\Modules\Licensing\Console\Commands\SyncLicenseCommand::class,
            ]);
        }

        /** @var array<string, string> $features */
        $features = config('licensing.features', []);

        foreach (array_keys($features) as $featureKey) {
            Gate::define("feature.{$featureKey}", function () use ($featureKey) {
                /** @var LicensingServiceInterface $service */
                $service = $this->app->make(LicensingServiceInterface::class);

                return $service->hasFeature((string) $featureKey);
            });
        }
    }
}
