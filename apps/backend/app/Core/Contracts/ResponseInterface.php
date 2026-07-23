<?php

declare(strict_types=1);

namespace App\Core\Contracts;

use Illuminate\Http\JsonResponse;

interface ResponseInterface
{
    /**
     * Return a success JSON response.
     *
     * @param  array<string, mixed>  $meta
     */
    public function successResponse(mixed $data = null, string $message = 'Success', int $code = 200, array $meta = []): JsonResponse;

    /**
     * Return an error JSON response.
     *
     * @param  array<string, mixed>  $errors
     */
    public function errorResponse(string $message = 'Error', int $code = 400, array $errors = []): JsonResponse;
}
