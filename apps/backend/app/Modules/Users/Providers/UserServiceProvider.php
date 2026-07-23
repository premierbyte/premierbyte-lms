<?php

namespace App\Modules\Users\Providers;

use App\Modules\Users\Repositories\UserRepository;
use App\Modules\Users\Repositories\UserRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class UserServiceProvider extends ServiceProvider
{
    /**
     * Register user repository bindings.
     */
    public function register(): void
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            UserRepository::class
        );
    }
}
