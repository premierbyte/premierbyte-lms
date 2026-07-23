<?php

namespace App\Modules\Organizations\Services;

use App\Core\BaseService;
use App\Modules\Organizations\DTOs\OrganizationDTO;
use App\Modules\Organizations\Models\Organization;
use App\Modules\Organizations\Repositories\OrganizationRepositoryInterface;
use Illuminate\Support\Facades\Cache;

class OrganizationService extends BaseService
{
    public function __construct(
        protected OrganizationRepositoryInterface $repository
    ) {}

    /**
     * Get primary organization details with caching.
     */
    public function getOrganization(): Organization
    {
        return Cache::remember('primary_organization_details', 3600, function () {
            return $this->repository->getPrimary();
        });
    }

    /**
     * Update primary organization details and clear cache.
     */
    public function updateOrganization(OrganizationDTO $dto): Organization
    {
        $current = $this->getOrganization();
        $updated = $this->repository->updateDTO($current->id, $dto);

        Cache::forget('primary_organization_details');
        $this->logInfo('Organization details updated', ['id' => $updated->id]);

        return $updated;
    }
}
