<?php

namespace App\Modules\Licensing\Services;

use App\Modules\Licensing\Contracts\LicensingServiceInterface;
use App\Modules\Licensing\DTOs\LicenseStatusDTO;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Premierbyte\LicensingSdk\Exceptions\LicenseException;
use Premierbyte\LicensingSdk\License;

class LicensingService implements LicensingServiceInterface
{
    protected License $sdk;

    /**
     * @param  array<string, mixed>|null  $config
     */
    public function __construct(?array $config = null)
    {
        $sdkConfig = $config ?? (array) config('licensing', []);
        $this->sdk = License::configure($sdkConfig);
    }

    /**
     * Get underlying SDK instance (useful for testing & custom HTTP client injection).
     */
    public function getSdk(): License
    {
        return $this->sdk;
    }

    /**
     * Verify license state online or via cached fallback.
     */
    public function verify(?string $licenseKey = null, ?string $domain = null): LicenseStatusDTO
    {
        $cacheKey = 'app_license_status_dto';

        try {
            $result = $this->sdk->verifyLicense($licenseKey, $domain);

            $statusDto = new LicenseStatusDTO(
                valid: $result->valid,
                status: $result->status,
                expiresAt: $result->expiresAt,
                plan: $result->plan,
                features: $result->features,
                inRestrictedMode: ! $result->valid,
                message: $result->valid ? 'License is active and valid.' : 'License is invalid or expired.'
            );

            Cache::put($cacheKey, $statusDto->toArray(), now()->addHours(6));

            return $statusDto;
        } catch (LicenseException $e) {
            Log::warning('Licensing SDK verification failed. Checking cached fallback.', ['error' => $e->getMessage()]);

            /** @var array<string, mixed>|null $cached */
            $cached = Cache::get($cacheKey);

            if (is_array($cached)) {
                return new LicenseStatusDTO(
                    valid: (bool) ($cached['valid'] ?? false),
                    status: (string) ($cached['status'] ?? 'cached_offline'),
                    expiresAt: isset($cached['expires_at']) ? (string) $cached['expires_at'] : null,
                    plan: isset($cached['plan']) && is_array($cached['plan']) ? $cached['plan'] : null,
                    features: isset($cached['features']) && is_array($cached['features']) ? $cached['features'] : [],
                    inRestrictedMode: false, // In grace period offline mode, stay active
                    message: 'Operating in offline cached grace period.'
                );
            }

            // Fallback restricted mode
            return new LicenseStatusDTO(
                valid: false,
                status: 'restricted_mode',
                expiresAt: null,
                plan: null,
                features: [],
                inRestrictedMode: true,
                message: 'Unreachable licensing server and no offline cache available. Application running in restricted mode.'
            );
        } catch (\Throwable $e) {
            Log::error('Unexpected exception during license verification.', ['exception' => $e->getMessage()]);

            return new LicenseStatusDTO(
                valid: false,
                status: 'restricted_mode',
                expiresAt: null,
                plan: null,
                features: [],
                inRestrictedMode: true,
                message: 'Licensing verification error. Operating in restricted mode.'
            );
        }
    }

    /**
     * Activate a license key for target domain.
     *
     * @return array<string, mixed>
     */
    public function activate(string $licenseKey, string $domain, ?string $ipAddress = null): array
    {
        try {
            $response = $this->sdk->activateLicense($licenseKey, $domain, $ipAddress);
            $this->verify($licenseKey, $domain);

            return $response;
        } catch (LicenseException $e) {
            Log::error('License activation failed.', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Check if a feature flag is enabled under current license.
     */
    public function hasFeature(string $featureKey): bool
    {
        $status = $this->getStatus();

        if ($status->inRestrictedMode || ! $status->valid) {
            return false;
        }

        return (bool) ($status->features[$featureKey] ?? false);
    }

    /**
     * Get active license status DTO.
     */
    public function getStatus(): LicenseStatusDTO
    {
        /** @var array<string, mixed>|null $cached */
        $cached = Cache::get('app_license_status_dto');

        if (is_array($cached)) {
            return new LicenseStatusDTO(
                valid: (bool) ($cached['valid'] ?? false),
                status: (string) ($cached['status'] ?? 'unknown'),
                expiresAt: isset($cached['expires_at']) ? (string) $cached['expires_at'] : null,
                plan: isset($cached['plan']) && is_array($cached['plan']) ? $cached['plan'] : null,
                features: isset($cached['features']) && is_array($cached['features']) ? $cached['features'] : [],
                inRestrictedMode: (bool) ($cached['in_restricted_mode'] ?? false),
                message: isset($cached['message']) ? (string) $cached['message'] : null
            );
        }

        return $this->verify();
    }

    /**
     * Synchronize license state with remote server.
     */
    public function sync(): LicenseStatusDTO
    {
        Cache::forget('app_license_status_dto');

        return $this->verify();
    }
}
