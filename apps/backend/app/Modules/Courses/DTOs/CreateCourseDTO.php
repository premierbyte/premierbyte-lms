<?php

declare(strict_types=1);

namespace App\Modules\Courses\DTOs;

use App\Core\BaseDTO;

class CreateCourseDTO extends BaseDTO
{
    public function __construct(
        public readonly int $categoryId,
        public readonly int $instructorId,
        public readonly string $title,
        public readonly string $slug,
        public readonly ?string $subtitle = null,
        public readonly ?string $description = null,
        public readonly string $status = 'draft',
        public readonly string $level = 'all_levels',
        public readonly string $language = 'en',
        public readonly float $price = 0.00,
        public readonly ?float $compareAtPrice = null,
        public readonly bool $isFree = false,
        public readonly bool $isFeatured = false,
        public readonly ?string $thumbnail = null,
        public readonly ?string $banner = null,
        public readonly ?string $metaTitle = null,
        public readonly ?string $metaDescription = null,
        public readonly ?string $metaKeywords = null
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            categoryId: (int) ($data['category_id'] ?? 0),
            instructorId: (int) ($data['instructor_id'] ?? 0),
            title: (string) ($data['title'] ?? ''),
            slug: (string) ($data['slug'] ?? ''),
            subtitle: isset($data['subtitle']) ? (string) $data['subtitle'] : null,
            description: isset($data['description']) ? (string) $data['description'] : null,
            status: (string) ($data['status'] ?? 'draft'),
            level: (string) ($data['level'] ?? 'all_levels'),
            language: (string) ($data['language'] ?? 'en'),
            price: isset($data['price']) ? (float) $data['price'] : 0.00,
            compareAtPrice: isset($data['compare_at_price']) ? (float) $data['compare_at_price'] : null,
            isFree: isset($data['is_free']) ? (bool) $data['is_free'] : false,
            isFeatured: isset($data['is_featured']) ? (bool) $data['is_featured'] : false,
            thumbnail: isset($data['thumbnail']) ? (string) $data['thumbnail'] : null,
            banner: isset($data['banner']) ? (string) $data['banner'] : null,
            metaTitle: isset($data['meta_title']) ? (string) $data['meta_title'] : null,
            metaDescription: isset($data['meta_description']) ? (string) $data['meta_description'] : null,
            metaKeywords: isset($data['meta_keywords']) ? (string) $data['meta_keywords'] : null
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'category_id' => $this->categoryId,
            'instructor_id' => $this->instructorId,
            'title' => $this->title,
            'slug' => $this->slug,
            'subtitle' => $this->subtitle,
            'description' => $this->description,
            'status' => $this->status,
            'level' => $this->level,
            'language' => $this->language,
            'price' => $this->isFree ? 0.00 : $this->price,
            'compare_at_price' => $this->compareAtPrice,
            'is_free' => $this->isFree,
            'is_featured' => $this->isFeatured,
            'thumbnail' => $this->thumbnail,
            'banner' => $this->banner,
            'meta_title' => $this->metaTitle,
            'meta_description' => $this->metaDescription,
            'meta_keywords' => $this->metaKeywords,
        ];
    }
}
