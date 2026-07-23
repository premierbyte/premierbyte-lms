<?php

namespace App\Modules\Categories\Repositories;

use App\Modules\Categories\DTOs\CreateCategoryDTO;
use App\Modules\Categories\DTOs\UpdateCategoryDTO;
use App\Modules\Categories\Models\Category;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class CategoryRepository implements CategoryRepositoryInterface
{
    /**
     * Get root category tree with nested children.
     *
     * @return Collection<int, Category>
     */
    public function getTree(): Collection
    {
        return Category::query()
            ->roots()
            ->with(['children' => function ($query) {
                $query->with('children');
            }])
            ->orderBy('sort_order', 'asc')
            ->get();
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

        return $query->orderBy('sort_order', 'asc')->get();
    }

    /**
     * Find category by ID.
     */
    public function findById(int $id): Category
    {
        return Category::with(['parent', 'children'])->findOrFail($id);
    }

    /**
     * Create category.
     */
    public function create(CreateCategoryDTO $dto): Category
    {
        return Category::create($dto->toArray());
    }

    /**
     * Update category.
     */
    public function update(int $id, UpdateCategoryDTO $dto): Category
    {
        $category = $this->findById($id);
        $category->update($dto->toArray());

        return $category;
    }

    /**
     * Delete category.
     */
    public function delete(int $id): bool
    {
        $category = $this->findById($id);

        return (bool) $category->delete();
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
