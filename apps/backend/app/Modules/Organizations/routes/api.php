<?php

use App\Modules\Organizations\Controllers\OrganizationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'feature:organizations'])->group(function () {
    Route::get('/organization', [OrganizationController::class, 'show'])->can('organizations.view');
    Route::put('/organization', [OrganizationController::class, 'update']);
});
