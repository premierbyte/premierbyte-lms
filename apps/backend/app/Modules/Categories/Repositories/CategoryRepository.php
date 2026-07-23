<?php

namespace App\Modules\Categories\Repositories;

use App\Core\BaseRepository;
use App\Modules\Categories\DTOs\CreateCategoryDTO;
use App\Modules\Categories\DTOs\UpdateCategoryDTO;
use App\Modules\Categories\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

/**
 * @extends BaseRepository<Category>
 */
class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    protected string $modelClass = Category::class;

    /**
     * Get root category tree with nested children.
     *
     * @return Collection<int, Category>
     */
    public function getTree(): Collection
    {
        /** @var Collection<int, Category> $result */
        $result = Category::query()
            ->roots()
            ->with(['children' => function ($query) {
                $query->with('children');
            }])
            ->orderBy('sort_order', 'asc')
            ->get();

        return $result;
    }

    /**
     * Get all categories in flat list.
     *
     * @return Collection<int, Category>
     */
    public function getAll(?string $search = null): Collection
    {
        $query = Category::query()->with('parent');

        if ($search !== null && $search !== '') {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        }

        /** @var Collection<int, Category> $result */
        $result = $query->orderBy('sort_order', 'asc')->get();

        return $result;
    }

    /**
     * Find category by ID.
     */
    public function findById(int $id): Category
    {
        /** @var Category $category */
        $category = Category::with(['parent', 'children'])->findOrFail($id);

        return $category;
    }

    /**
     * Create category.
     */
    public function createCategory(CreateCategoryDTO $dto): Category
    {
        /** @var Category $category */
        $category = $this->create($dto->toArray());

        return $category;
    }

    /**
     * Update category.
     */
    public function updateCategory(int $id, UpdateCategoryDTO $dto): Category
    {
        /** @var Category $category */
        $category = $this->update($id, $dto->toArray());

        return $category;
    }

    /**
     * Delete category.
     */
    public function deleteCategory(int $id): bool
    {
        return $this->delete($id);
    }

    /**
     * Batch update category sort order.
     *
     * @param  array<int, array{id: int, sort_order: int}>  $items
     */
    public function reorder(array $items): void
    {
        DB::transaction(function () use ($items) {
            foreach ($items as $item) {
                Category::where('id', $item['id'])->update([
                    'sort_order' => (int) $item['sort_order'],
                ]);
            }
        });
    }
}
