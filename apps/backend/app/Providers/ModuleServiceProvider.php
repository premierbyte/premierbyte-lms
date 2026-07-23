<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $modulesPath = app_path('Modules');

        if (! File::isDirectory($modulesPath)) {
            return;
        }

        $modules = File::directories($modulesPath);

        foreach ($modules as $moduleDir) {
            $apiRoutesPath = $moduleDir.'/routes/api.php';
            if (File::exists($apiRoutesPath)) {
                Route::middleware('api')
                    ->prefix('api/v1')
                    ->group($apiRoutesPath);
            }

            $migrationsPath = $moduleDir.'/Database/Migrations';
            if (File::isDirectory($migrationsPath)) {
                $this->loadMigrationsFrom($migrationsPath);
            }
        }
    }
}
