<?php

namespace App\Modules\Categories\Services;

use App\Core\BaseService;
use App\Modules\Categories\DTOs\CreateCategoryDTO;
use App\Modules\Categories\DTOs\UpdateCategoryDTO;
use App\Modules\Categories\Models\Category;
use App\Modules\Categories\Repositories\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class CategoryService extends BaseService
{
    public function __construct(
        protected CategoryRepositoryInterface $repository
    ) {}

    /**
     * Get root category tree.
     *
     * @return Collection<int, Category>
     */
    public function getCategoryTree(): Collection
    {
        return $this->repository->getTree();
    }

    /**
     * Get all categories.
     *
     * @return Collection<int, Category>
     */
    public function getAllCategories(?string $search = null): Collection
    {
        return $this->repository->getAll($search);
    }

    /**
     * Get category by ID.
     */
    public function getCategory(int $id): Category
    {
        return $this->repository->findById($id);
    }

    /**
     * Create new category.
     */
    public function createCategory(CreateCategoryDTO $dto): Category
    {
        $category = $this->repository->createCategory($dto);
        $this->logInfo('Category created', ['id' => $category->id, 'name' => $category->name]);

        return $category;
    }

    /**
     * Update category with circular parent validation.
     */
    public function updateCategory(int $id, UpdateCategoryDTO $dto): Category
    {
        if ($dto->parentId !== null) {
            if ($dto->parentId === $id) {
                throw new \InvalidArgumentException('A category cannot be its own parent.');
            }

            if ($this->isDescendant($id, $dto->parentId)) {
                throw new \InvalidArgumentException('Cannot set a descendant category as parent.');
            }
        }

        $category = $this->repository->updateCategory($id, $dto);
        $this->logInfo('Category updated', ['id' => $category->id]);

        return $category;
    }

    /**
     * Delete category.
     */
    public function deleteCategory(int $id): bool
    {
        $result = $this->repository->deleteCategory($id);
        $this->logInfo('Category deleted', ['id' => $id]);

        return $result;
    }

    /**
     * Reorder categories.
     *
     * @param  array<int, array{id: int, sort_order: int}>  $items
     */
    public function reorderCategories(array $items): void
    {
        $this->repository->reorder($items);
        $this->logInfo('Categories reordered', ['count' => count($items)]);
    }

    /**
     * Check if potentialParentId is a descendant of categoryId.
     */
    protected function isDescendant(int $categoryId, int $potentialParentId): bool
    {
        $current = Category::find($potentialParentId);

        while ($current !== null && $current->parent_id !== null) {
            if ($current->parent_id === $categoryId) {
                return true;
            }
            $current = Category::find($current->parent_id);
        }

        return false;
    }
}
