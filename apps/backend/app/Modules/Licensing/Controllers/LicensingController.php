<?php

namespace App\Modules\Licensing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Licensing\Contracts\LicensingServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LicensingController extends Controller
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

        return response()->json([
            'success' => true,
            'data' => $status->toArray(),
        ]);
    }

    /**
     * Get feature flags dictionary.
     */
    public function features(): JsonResponse
    {
        $status = $this->licensingService->getStatus();

        return response()->json([
            'success' => true,
            'data' => [
                'in_restricted_mode' => $status->inRestrictedMode,
                'features' => $status->features,
            ],
        ]);
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

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
}
