<?php

declare(strict_types=1);

namespace App\Modules\Courses\Requests;

use App\Modules\Courses\DTOs\CreateCourseDTO;
use Illuminate\Foundation\Http\FormRequest;

class CreateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('courses.create') ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'instructor_id' => ['nullable', 'integer', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:courses,slug'],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['nullable', 'string', 'in:draft,published,archived'],
            'level' => ['nullable', 'string', 'in:beginner,intermediate,advanced,all_levels'],
            'language' => ['nullable', 'string', 'max:10'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'compare_at_price' => ['nullable', 'numeric', 'min:0'],
            'is_free' => ['nullable', 'boolean'],
            'is_featured' => ['nullable', 'boolean'],
            'thumbnail' => ['nullable', 'string', 'max:2048'],
            'banner' => ['nullable', 'string', 'max:2048'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function toDTO(): CreateCourseDTO
    {
        $validated = $this->validated();
        if (empty($validated['instructor_id'])) {
            $user = $this->user();
            $validated['instructor_id'] = $user !== null ? $user->id : 1;
        }

        return CreateCourseDTO::fromArray($validated);
    }
}
