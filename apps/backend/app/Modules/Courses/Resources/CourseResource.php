<?php

declare(strict_types=1);

namespace App\Modules\Courses\Resources;

use App\Modules\Categories\Resources\CategoryResource;
use App\Modules\Courses\Models\Course;
use App\Modules\Users\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Course
 */
class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'instructor_id' => $this->instructor_id,
            'title' => $this->title,
            'slug' => $this->slug,
            'subtitle' => $this->subtitle,
            'description' => $this->description,
            'status' => $this->status,
            'level' => $this->level,
            'language' => $this->language,
            'price' => (float) $this->price,
            'compare_at_price' => $this->compare_at_price !== null ? (float) $this->compare_at_price : null,
            'is_free' => (bool) $this->is_free,
            'is_featured' => (bool) $this->is_featured,
            'thumbnail' => $this->thumbnail,
            'banner' => $this->banner,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            'category' => $this->whenLoaded('category', fn () => new CategoryResource($this->category)),
            'instructor' => $this->whenLoaded('instructor', fn () => new UserResource($this->instructor)),
        ];
    }
}
