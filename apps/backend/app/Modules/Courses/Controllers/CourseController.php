<?php

declare(strict_types=1);

namespace App\Modules\Courses\Controllers;

use App\Core\BaseController;
use App\Modules\Courses\Requests\CreateCourseRequest;
use App\Modules\Courses\Requests\UpdateCourseRequest;
use App\Modules\Courses\Resources\CourseResource;
use App\Modules\Courses\Services\CourseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends BaseController
{
    public function __construct(
        protected CourseService $service
    ) {}

    /**
     * List courses with filtering and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 15);
        $search = $request->query('search') ? (string) $request->query('search') : null;
        $categoryId = $request->query('category_id') ? (int) $request->query('category_id') : null;
        $status = $request->query('status') ? (string) $request->query('status') : null;
        $level = $request->query('level') ? (string) $request->query('level') : null;
        $isFeatured = $request->has('is_featured') ? $request->boolean('is_featured') : null;

        $paginator = $this->service->getCourses($perPage, $search, $categoryId, $status, $level, $isFeatured);

        return response()->json([
            'success' => true,
            'message' => 'Courses retrieved successfully',
            'data' => CourseResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'code' => 200,
        ], 200);
    }

    /**
     * Show single course details.
     */
    public function show(int $id): JsonResponse
    {
        $course = $this->service->getCourse($id);

        return $this->successResponse(new CourseResource($course), 'Course retrieved successfully');
    }

    /**
     * Create a new course.
     */
    public function store(CreateCourseRequest $request): JsonResponse
    {
        $course = $this->service->createCourse($request->toDTO());

        return $this->successResponse(new CourseResource($course), 'Course created successfully.', 201);
    }

    /**
     * Update an existing course.
     */
    public function update(UpdateCourseRequest $request, int $id): JsonResponse
    {
        $course = $this->service->updateCourse($id, $request->toDTO());

        return $this->successResponse(new CourseResource($course), 'Course updated successfully.');
    }

    /**
     * Publish or unpublish a course.
     */
    public function publish(Request $request, int $id): JsonResponse
    {
        if (! $request->user()?->can('courses.publish')) {
            return $this->errorResponse('Forbidden', 403);
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:draft,published,archived'],
        ]);

        $course = $this->service->publishCourse($id, (string) $validated['status']);

        return $this->successResponse(new CourseResource($course), 'Course publish status updated successfully.');
    }

    /**
     * Delete a course.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        if (! $request->user()?->can('courses.delete')) {
            return $this->errorResponse('Forbidden', 403);
        }

        $this->service->deleteCourse($id);

        return $this->successResponse(null, 'Course deleted successfully.');
    }
}
