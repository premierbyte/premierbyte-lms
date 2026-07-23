<?php

use App\Modules\Licensing\Controllers\LicensingController;
use Illuminate\Support\Facades\Route;

Route::get('/licensing/status', [LicensingController::class, 'status']);
Route::get('/licensing/features', [LicensingController::class, 'features']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/licensing/activate', [LicensingController::class, 'activate']);
});
