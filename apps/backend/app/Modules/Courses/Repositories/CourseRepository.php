<?php

declare(strict_types=1);

namespace App\Modules\Courses\Repositories;

use App\Core\BaseRepository;
use App\Modules\Courses\DTOs\CreateCourseDTO;
use App\Modules\Courses\DTOs\UpdateCourseDTO;
use App\Modules\Courses\Models\Course;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * @extends BaseRepository<Course>
 */
class CourseRepository extends BaseRepository implements CourseRepositoryInterface
{
    protected string $modelClass = Course::class;

    /**
     * Paginate courses with filters.
     *
     * @return LengthAwarePaginator<int, Course>
     */
    public function paginateFiltered(
        int $perPage = 15,
        ?string $search = null,
        ?int $categoryId = null,
        ?string $status = null,
        ?string $level = null,
        ?bool $isFeatured = null
    ): LengthAwarePaginator {
        $query = Course::query()->with(['category', 'instructor']);

        if ($search !== null && $search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('subtitle', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($categoryId !== null && $categoryId > 0) {
            $query->where('category_id', $categoryId);
        }

        if ($status !== null && $status !== '') {
            $query->where('status', $status);
        }

        if ($level !== null && $level !== '') {
            $query->where('level', $level);
        }

        if ($isFeatured !== null) {
            $query->where('is_featured', $isFeatured);
        }

        /** @var LengthAwarePaginator<int, Course> $result */
        $result = $query->latest()->paginate($perPage);

        return $result;
    }

    /**
     * Find course by ID with relations.
     */
    public function findById(int $id): Course
    {
        /** @var Course $course */
        $course = Course::with(['category', 'instructor'])->findOrFail($id);

        return $course;
    }

    /**
     * Create course.
     */
    public function createCourse(CreateCourseDTO $dto): Course
    {
        /** @var Course $course */
        $course = $this->create($dto->toArray());

        return $course;
    }

    /**
     * Update course.
     */
    public function updateCourse(int $id, UpdateCourseDTO $dto): Course
    {
        /** @var Course $course */
        $course = $this->update($id, $dto->toArray());

        return $course;
    }

    /**
     * Publish or unpublish course.
     */
    public function setPublishStatus(int $id, string $status): Course
    {
        $course = $this->findById($id);

        $payload = [
            'status' => $status,
        ];

        if ($status === 'published' && $course->published_at === null) {
            $payload['published_at'] = now();
        }

        $course->update($payload);

        return $course;
    }

    /**
     * Delete course.
     */
    public function deleteCourse(int $id): bool
    {
        return $this->delete($id);
    }
}
