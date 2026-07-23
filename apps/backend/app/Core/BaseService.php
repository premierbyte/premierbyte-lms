<?php

declare(strict_types=1);

namespace App\Core;

use Closure;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

abstract class BaseService
{
    /**
     * Execute callback within database transaction.
     *
     * @template T
     *
     * @param  Closure(): T  $callback
     * @return T
     *
     * @throws Throwable
     */
    protected function transaction(Closure $callback): mixed
    {
        return DB::transaction($callback);
    }

    /**
     * Log info message with domain context.
     *
     * @param  array<string, mixed>  $context
     */
    protected function logInfo(string $message, array $context = []): void
    {
        Log::info(sprintf('[%s] %s', static::class, $message), $context);
    }

    /**
     * Log error message with domain context.
     *
     * @param  array<string, mixed>  $context
     */
    protected function logError(string $message, array $context = []): void
    {
        Log::error(sprintf('[%s] %s', static::class, $message), $context);
    }
}
