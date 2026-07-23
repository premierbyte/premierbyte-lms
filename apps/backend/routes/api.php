<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Module routes are automatically discovered and loaded by ModuleServiceProvider
| from app/Modules/*\/routes/api.php under the /api/v1 prefix.
|
*/

Route::get('/', function () {
    return response()->json([
        'name' => 'Premierbyte LMS API',
        'version' => 'v1',
        'status' => 'operational',
    ]);
});
