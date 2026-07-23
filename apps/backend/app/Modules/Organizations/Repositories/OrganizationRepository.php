<?php

namespace App\Modules\Organizations\Repositories;

use App\Core\BaseRepository;
use App\Modules\Organizations\DTOs\OrganizationDTO;
use App\Modules\Organizations\Models\Organization;

/**
 * @extends BaseRepository<Organization>
 */
class OrganizationRepository extends BaseRepository implements OrganizationRepositoryInterface
{
    protected string $modelClass = Organization::class;

    /**
     * Get primary organization or create default one.
     */
    public function getPrimary(): Organization
    {
        /** @var Organization|null $organization */
        $organization = Organization::first();

        if ($organization === null) {
            /** @var Organization $organization */
            $organization = $this->create([
                'name' => 'Premierbyte LMS',
                'slug' => 'premierbyte-lms',
                'email' => 'admin@premierbyte.com',
                'phone' => '+1 (555) 019-2834',
                'address' => '100 Innovation Way',
                'country' => 'United States',
                'state' => 'California',
                'city' => 'San Francisco',
                'timezone' => 'UTC',
                'locale' => 'en',
                'primary_color' => '#4f46e5',
                'secondary_color' => '#9333ea',
                'status' => 'active',
            ]);
        }

        return $organization;
    }

    /**
     * Update organization by ID.
     */
    public function updateDTO(int $id, OrganizationDTO $dto): Organization
    {
        /** @var Organization $organization */
        $organization = $this->update($id, $dto->toArray());

        return $organization;
    }
}
