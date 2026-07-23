<?php

namespace App\Modules\Organizations\Providers;

use App\Modules\Organizations\Repositories\OrganizationRepository;
use App\Modules\Organizations\Repositories\OrganizationRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class OrganizationServiceProvider extends ServiceProvider
{
    /**
     * Register organization bindings.
     */
    public function register(): void
    {
        $this->app->bind(
            OrganizationRepositoryInterface::class,
            OrganizationRepository::class
        );
    }
}
