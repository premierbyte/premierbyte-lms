<?php

namespace App\Modules\Categories\DTOs;

use App\Core\BaseDTO;

class UpdateCategoryDTO extends BaseDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $slug,
        public readonly ?int $parentId = null,
        public readonly ?string $description = null,
        public readonly ?string $image = null,
        public readonly string $status = 'active',
        public readonly int $sortOrder = 0
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: (string) ($data['name'] ?? ''),
            slug: (string) ($data['slug'] ?? ''),
            parentId: isset($data['parent_id']) && $data['parent_id'] !== '' ? (int) $data['parent_id'] : null,
            description: isset($data['description']) ? (string) $data['description'] : null,
            image: isset($data['image']) ? (string) $data['image'] : null,
            status: (string) ($data['status'] ?? 'active'),
            sortOrder: isset($data['sort_order']) ? (int) $data['sort_order'] : 0
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'slug' => $this->slug,
            'parent_id' => $this->parentId,
            'description' => $this->description,
            'image' => $this->image,
            'status' => $this->status,
            'sort_order' => $this->sortOrder,
        ];
    }
}
