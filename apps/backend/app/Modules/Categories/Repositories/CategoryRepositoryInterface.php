<?php

namespace App\Modules\Categories\Repositories;

use App\Modules\Categories\DTOs\CreateCategoryDTO;
use App\Modules\Categories\DTOs\UpdateCategoryDTO;
use App\Modules\Categories\Models\Category;
use Illuminate\Database\Eloquent\Collection;

interface CategoryRepositoryInterface
{
    /**
     * Get root category tree with nested children.
     *
     * @return Collection<int, Category>
     */
    public function getTree(): Collection;

    /**
     * Get all categories in flat list.
     *
     * @return Collection<int, Category>
     */
    public function getAll(?string $search = null): Collection;

    /**
     * Find category by ID.
     */
    public function findById(int $id): Category;

    /**
     * Create category.
     */
    public function createCategory(CreateCategoryDTO $dto): Category;

    /**
     * Update category.
     */
    public function updateCategory(int $id, UpdateCategoryDTO $dto): Category;

    /**
     * Delete category.
     */
    public function deleteCategory(int $id): bool;

    /**
     * Batch update category sort order.
     *
     * @param  array<int, array{id: int, sort_order: int}>  $items
     */
    public function reorder(array $items): void;
}
