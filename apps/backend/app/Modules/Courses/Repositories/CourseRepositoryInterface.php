<?php

declare(strict_types=1);

namespace App\Modules\Courses\Repositories;

use App\Modules\Courses\DTOs\CreateCourseDTO;
use App\Modules\Courses\DTOs\UpdateCourseDTO;
use App\Modules\Courses\Models\Course;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CourseRepositoryInterface
{
    /**
     * Paginate courses with optional search, category, status, level, and featured filters.
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
    ): LengthAwarePaginator;

    /**
     * Find course by ID.
     */
    public function findById(int $id): Course;

    /**
     * Create course.
     */
    public function createCourse(CreateCourseDTO $dto): Course;

    /**
     * Update course.
     */
    public function updateCourse(int $id, UpdateCourseDTO $dto): Course;

    /**
     * Publish or unpublish course.
     */
    public function setPublishStatus(int $id, string $status): Course;

    /**
     * Delete course.
     */
    public function deleteCourse(int $id): bool;
}
