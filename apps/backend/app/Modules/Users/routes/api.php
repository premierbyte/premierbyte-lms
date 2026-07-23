<?php

use App\Modules\Users\Controllers\AuthController;
use App\Modules\Users\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('/users', [UserController::class, 'index'])->can('users.view');
    Route::post('/users', [UserController::class, 'store'])->can('users.create');
    Route::post('/users/invite', [UserController::class, 'invite']);
    Route::get('/users/{id}', [UserController::class, 'show'])->can('users.view');
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});
