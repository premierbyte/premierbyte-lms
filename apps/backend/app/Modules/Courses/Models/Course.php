<?php

declare(strict_types=1);

namespace App\Modules\Courses\Models;

use App\Models\User;
use App\Modules\Categories\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Course extends Model
{
    protected $fillable = [
        'category_id',
        'instructor_id',
        'title',
        'slug',
        'subtitle',
        'description',
        'status',
        'level',
        'language',
        'price',
        'compare_at_price',
        'is_free',
        'is_featured',
        'thumbnail',
        'banner',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'published_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_at_price' => 'decimal:2',
        'is_free' => 'boolean',
        'is_featured' => 'boolean',
        'published_at' => 'datetime',
    ];

    /**
     * Get the category that owns the course.
     *
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the instructor that created the course.
     *
     * @return BelongsTo<User, $this>
     */
    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    /**
     * Scope query to published courses.
     *
     * @param  Builder<$this>  $query
     * @return Builder<$this>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    /**
     * Scope query to featured courses.
     *
     * @param  Builder<$this>  $query
     * @return Builder<$this>
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope query to draft courses.
     *
     * @param  Builder<$this>  $query
     * @return Builder<$this>
     */
    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', 'draft');
    }
}
