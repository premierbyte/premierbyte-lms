<?php

declare(strict_types=1);

namespace App\Modules\Courses\Services;

use App\Core\BaseService;
use App\Modules\Courses\DTOs\CreateCourseDTO;
use App\Modules\Courses\DTOs\UpdateCourseDTO;
use App\Modules\Courses\Models\Course;
use App\Modules\Courses\Repositories\CourseRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CourseService extends BaseService
{
    public function __construct(
        protected CourseRepositoryInterface $repository
    ) {}

    /**
     * Get paginated list of courses.
     *
     * @return LengthAwarePaginator<int, Course>
     */
    public function getCourses(
        int $perPage = 15,
        ?string $search = null,
        ?int $categoryId = null,
        ?string $status = null,
        ?string $level = null,
        ?bool $isFeatured = null
    ): LengthAwarePaginator {
        return $this->repository->paginateFiltered($perPage, $search, $categoryId, $status, $level, $isFeatured);
    }

    /**
     * Get course by ID.
     */
    public function getCourse(int $id): Course
    {
        return $this->repository->findById($id);
    }

    /**
     * Create new course.
     */
    public function createCourse(CreateCourseDTO $dto): Course
    {
        $course = $this->repository->createCourse($dto);
        $this->logInfo('Course created', ['id' => $course->id, 'title' => $course->title]);

        return $course;
    }

    /**
     * Update existing course.
     */
    public function updateCourse(int $id, UpdateCourseDTO $dto): Course
    {
        $course = $this->repository->updateCourse($id, $dto);
        $this->logInfo('Course updated', ['id' => $course->id]);

        return $course;
    }

    /**
     * Change publication status of a course.
     */
    public function publishCourse(int $id, string $status): Course
    {
        $course = $this->repository->setPublishStatus($id, $status);
        $this->logInfo('Course publish status updated', ['id' => $course->id, 'status' => $status]);

        return $course;
    }

    /**
     * Delete course.
     */
    public function deleteCourse(int $id): bool
    {
        $result = $this->repository->deleteCourse($id);
        $this->logInfo('Course deleted', ['id' => $id]);

        return $result;
    }
}
