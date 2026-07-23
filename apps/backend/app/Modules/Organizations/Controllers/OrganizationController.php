<?php

namespace App\Modules\Organizations\Controllers;

use App\Core\BaseController;
use App\Modules\Organizations\Requests\UpdateOrganizationRequest;
use App\Modules\Organizations\Resources\OrganizationResource;
use App\Modules\Organizations\Services\OrganizationService;
use Illuminate\Http\JsonResponse;

class OrganizationController extends BaseController
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

        return $this->successResponse(new OrganizationResource($organization), 'Organization details retrieved successfully');
    }

    /**
     * Update organization settings.
     */
    public function update(UpdateOrganizationRequest $request): JsonResponse
    {
        $updated = $this->service->updateOrganization($request->toDTO());

        return $this->successResponse(new OrganizationResource($updated), 'Organization settings updated successfully.');
    }
}
