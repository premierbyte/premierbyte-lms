<?php

namespace App\Modules\Licensing\Controllers;

use App\Core\BaseController;
use App\Modules\Licensing\Contracts\LicensingServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LicensingController extends BaseController
{
    public function __construct(
        protected LicensingServiceInterface $licensingService
    ) {}

    /**
     * Get overall license status.
     */
    public function status(): JsonResponse
    {
        $status = $this->licensingService->getStatus();

        return $this->successResponse($status->toArray(), 'License status retrieved successfully');
    }

    /**
     * Get feature flags dictionary.
     */
    public function features(): JsonResponse
    {
        $status = $this->licensingService->getStatus();

        return $this->successResponse([
            'in_restricted_mode' => $status->inRestrictedMode,
            'features' => $status->features,
        ], 'Feature flags retrieved successfully');
    }

    /**
     * Activate a new license key.
     */
    public function activate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'license_key' => ['required', 'string'],
            'domain' => ['required', 'string'],
        ]);

        $result = $this->licensingService->activate(
            (string) $validated['license_key'],
            (string) $validated['domain'],
            $request->ip()
        );

        return $this->successResponse($result, 'License activated successfully');
    }
}
