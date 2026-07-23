<?php

use App\Modules\Categories\Controllers\CategoryController;
use App\Modules\Licensing\Controllers\LicensingController;
use App\Modules\Organizations\Controllers\OrganizationController;
use App\Modules\Users\Controllers\AuthController;
use App\Modules\Users\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Licensing Status & Features endpoints
    Route::get('/licensing/status', [LicensingController::class, 'status']);
    Route::get('/licensing/features', [LicensingController::class, 'features']);

    // Authenticated Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/licensing/activate', [LicensingController::class, 'activate']);

        // User Management Endpoints
        Route::get('/users', [UserController::class, 'index'])->can('users.view');
        Route::post('/users', [UserController::class, 'store'])->can('users.create');
        Route::post('/users/invite', [UserController::class, 'invite']);
        Route::get('/users/{id}', [UserController::class, 'show'])->can('users.view');
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Category Management Endpoints
        Route::get('/categories', [CategoryController::class, 'index'])->can('categories.view');
        Route::post('/categories', [CategoryController::class, 'store'])->can('categories.create');
        Route::post('/categories/reorder', [CategoryController::class, 'reorder']);
        Route::get('/categories/{id}', [CategoryController::class, 'show'])->can('categories.view');
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // Feature Gated Organization Management
        Route::middleware('feature:organizations')->group(function () {
            Route::get('/organization', [OrganizationController::class, 'show'])->can('organizations.view');
            Route::put('/organization', [OrganizationController::class, 'update']);
        });
    });
});
