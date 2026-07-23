<?php

declare(strict_types=1);

namespace App\Core;

use JsonSerializable;

abstract class BaseDTO implements JsonSerializable
{
    /**
     * Convert DTO to array.
     *
     * @return array<string, mixed>
     */
    abstract public function toArray(): array;

    /**
     * Serialize DTO to JSON.
     *
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
