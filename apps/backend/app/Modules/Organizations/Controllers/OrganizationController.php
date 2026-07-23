<?php

namespace App\Modules\Organizations\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Organizations\Requests\UpdateOrganizationRequest;
use App\Modules\Organizations\Resources\OrganizationResource;
use App\Modules\Organizations\Services\OrganizationService;
use Illuminate\Http\JsonResponse;

class OrganizationController extends Controller
{
    public function __construct(
        protected OrganizationService $service
    ) {}

    /**
     * Get organization settings.
     */
    public function show(): JsonResponse
    {
        $organization = $this->service->getOrganization();

        return response()->json([
            'success' => true,
            'data' => new OrganizationResource($organization),
        ]);
    }

    /**
     * Update organization settings.
     */
    public function update(UpdateOrganizationRequest $request): JsonResponse
    {
        $updated = $this->service->updateOrganization($request->toDTO());

        return response()->json([
            'success' => true,
            'message' => 'Organization settings updated successfully.',
            'data' => new OrganizationResource($updated),
        ]);
    }
}
