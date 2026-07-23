<?php

use App\Modules\Categories\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index'])->can('categories.view');
    Route::post('/categories', [CategoryController::class, 'store'])->can('categories.create');
    Route::post('/categories/reorder', [CategoryController::class, 'reorder']);
    Route::get('/categories/{id}', [CategoryController::class, 'show'])->can('categories.view');
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
});
