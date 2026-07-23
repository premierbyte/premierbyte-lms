<?php

namespace App\Modules\Licensing\Contracts;

use App\Modules\Licensing\DTOs\LicenseStatusDTO;

interface LicensingServiceInterface
{
    /**
     * Verify license online or using cache fallback.
     */
    public function verify(?string $licenseKey = null, ?string $domain = null): LicenseStatusDTO;

    /**
     * Activate a license key for a domain.
     *
     * @return array<string, mixed>
     */
    public function activate(string $licenseKey, string $domain, ?string $ipAddress = null): array;

    /**
     * Check if a feature flag is enabled.
     */
    public function hasFeature(string $featureKey): bool;

    /**
     * Get active license status DTO.
     */
    public function getStatus(): LicenseStatusDTO;

    /**
     * Synchronize license status with remote server.
     */
    public function sync(): LicenseStatusDTO;
}
