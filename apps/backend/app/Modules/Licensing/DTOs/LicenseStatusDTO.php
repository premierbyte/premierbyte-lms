<?php

namespace App\Modules\Licensing\DTOs;

class LicenseStatusDTO
{
    /**
     * @param  array<string, mixed>|null  $plan
     * @param  array<string, bool>  $features
     */
    public function __construct(
        public readonly bool $valid,
        public readonly string $status,
        public readonly ?string $expiresAt = null,
        public readonly ?array $plan = null,
        public readonly array $features = [],
        public readonly bool $inRestrictedMode = false,
        public readonly ?string $message = null
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'valid' => $this->valid,
            'status' => $this->status,
            'expires_at' => $this->expiresAt,
            'plan' => $this->plan,
            'features' => $this->features,
            'in_restricted_mode' => $this->inRestrictedMode,
            'message' => $this->message,
        ];
    }
}
