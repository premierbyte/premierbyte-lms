<?php

namespace App\Modules\Categories\Providers;

use App\Modules\Categories\Repositories\CategoryRepository;
use App\Modules\Categories\Repositories\CategoryRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class CategoryServiceProvider extends ServiceProvider
{
    /**
     * Register category bindings.
     */
    public function register(): void
    {
        $this->app->bind(
            CategoryRepositoryInterface::class,
            CategoryRepository::class
        );
    }
}
