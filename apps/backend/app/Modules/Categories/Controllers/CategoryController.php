<?php

namespace App\Modules\Categories\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Categories\Requests\CreateCategoryRequest;
use App\Modules\Categories\Requests\UpdateCategoryRequest;
use App\Modules\Categories\Resources\CategoryResource;
use App\Modules\Categories\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $service
    ) {}

    /**
     * Display a listing of categories (Tree structure or flat list).
     */
    public function index(Request $request): JsonResponse
    {
        $mode = $request->query('mode', 'tree');
        $search = $request->query('search') ? (string) $request->query('search') : null;

        if ($mode === 'tree' && $search === null) {
            $categories = $this->service->getCategoryTree();
        } else {
            $categories = $this->service->getAllCategories($search);
        }

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * Display specified category details.
     */
    public function show(int $id): JsonResponse
    {
        $category = $this->service->getCategory($id);

        return response()->json([
            'success' => true,
            'data' => new CategoryResource($category),
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(CreateCategoryRequest $request): JsonResponse
    {
        $category = $this->service->createCategory($request->toDTO());

        return response()->json([
            'success' => true,
            'message' => 'Category created successfully.',
            'data' => new CategoryResource($category),
        ], 201);
    }

    /**
     * Update specified category.
     */
    public function update(UpdateCategoryRequest $request, int $id): JsonResponse
    {
        try {
            $category = $this->service->updateCategory($id, $request->toDTO());

            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully.',
                'data' => new CategoryResource($category),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Delete specified category.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        if (! $request->user()?->can('categories.delete')) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $this->service->deleteCategory($id);

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully.',
        ]);
    }

    /**
     * Batch reorder category ranks.
     */
    public function reorder(Request $request): JsonResponse
    {
        if (! $request->user()?->can('categories.update')) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer', 'exists:categories,id'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        /** @var array<int, array{id: int, sort_order: int}> $items */
        $items = $validated['items'];

        $this->service->reorderCategories($items);

        return response()->json([
            'success' => true,
            'message' => 'Category order updated successfully.',
        ]);
    }
}
