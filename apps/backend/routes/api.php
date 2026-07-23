<?php

use App\Modules\Licensing\Controllers\LicensingController;
use App\Modules\Organizations\Controllers\OrganizationController;
use App\Modules\Users\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Licensing Status & Features endpoints
    Route::get('/licensing/status', [LicensingController::class, 'status']);
    Route::get('/licensing/features', [LicensingController::class, 'features']);

    // Authenticated Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/licensing/activate', [LicensingController::class, 'activate']);

        // Feature Gated Organization Management
        Route::middleware('feature:organizations')->group(function () {
            Route::get('/organization', [OrganizationController::class, 'show'])->can('organizations.view');
            Route::put('/organization', [OrganizationController::class, 'update']);
        });
    });
});
