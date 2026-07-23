<?php

declare(strict_types=1);

namespace App\Modules\Courses\Providers;

use App\Modules\Courses\Repositories\CourseRepository;
use App\Modules\Courses\Repositories\CourseRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class CourseServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(CourseRepositoryInterface::class, CourseRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
