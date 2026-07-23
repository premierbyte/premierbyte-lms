<?php

use App\Modules\Courses\Controllers\CourseController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/courses', [CourseController::class, 'index'])->can('courses.view');
    Route::post('/courses', [CourseController::class, 'store'])->can('courses.create');
    Route::get('/courses/{id}', [CourseController::class, 'show'])->can('courses.view');
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::post('/courses/{id}/publish', [CourseController::class, 'publish']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);
});
