<?php

namespace App\Modules\Organizations\Repositories;

use App\Modules\Organizations\DTOs\OrganizationDTO;
use App\Modules\Organizations\Models\Organization;

interface OrganizationRepositoryInterface
{
    /**
     * Get primary organization or create default one.
     */
    public function getPrimary(): Organization;

    /**
     * Update organization by ID.
     */
    public function update(int $id, OrganizationDTO $dto): Organization;
}
