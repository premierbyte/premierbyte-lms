<?php

namespace App\Modules\Courses\Tests;

use App\Models\User;
use App\Modules\Categories\Models\Category;
use App\Modules\Courses\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class CourseTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        Permission::findOrCreate('courses.view', 'web');
        Permission::findOrCreate('courses.create', 'web');
        Permission::findOrCreate('courses.update', 'web');
        Permission::findOrCreate('courses.publish', 'web');
        Permission::findOrCreate('courses.delete', 'web');

        $this->user = User::factory()->create();
        $this->user->givePermissionTo([
            'courses.view',
            'courses.create',
            'courses.update',
            'courses.publish',
            'courses.delete',
        ]);

        $this->category = Category::create([
            'name' => 'Web Development',
            'slug' => 'web-development',
            'status' => 'active',
        ]);
    }

    public function test_can_list_courses(): void
    {
        Course::create([
            'category_id' => $this->category->id,
            'instructor_id' => $this->user->id,
            'title' => 'Master React 19',
            'slug' => 'master-react-19',
            'status' => 'published',
            'price' => 49.99,
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/v1/courses');

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data');
    }

    public function test_can_create_course(): void
    {
        $payload = [
            'category_id' => $this->category->id,
            'title' => 'Fullstack Next.js 16',
            'slug' => 'fullstack-nextjs-16',
            'subtitle' => 'Build modern web apps',
            'description' => 'Comprehensive Next.js 16 guide',
            'level' => 'intermediate',
            'price' => 99.99,
            'is_free' => false,
            'is_featured' => true,
            'meta_title' => 'Next.js 16 Course',
        ];

        $response = $this->actingAs($this->user)->postJson('/api/v1/courses', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Fullstack Next.js 16')
            ->assertJsonPath('data.is_featured', true);

        $this->assertDatabaseHas('courses', [
            'slug' => 'fullstack-nextjs-16',
            'status' => 'draft',
        ]);
    }

    public function test_can_publish_course(): void
    {
        $course = Course::create([
            'category_id' => $this->category->id,
            'instructor_id' => $this->user->id,
            'title' => 'Laravel 12 Masterclass',
            'slug' => 'laravel-12-masterclass',
            'status' => 'draft',
        ]);

        $response = $this->actingAs($this->user)->postJson("/api/v1/courses/{$course->id}/publish", [
            'status' => 'published',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'published');

        $this->assertDatabaseHas('courses', [
            'id' => $course->id,
            'status' => 'published',
        ]);
    }

    public function test_can_delete_course(): void
    {
        $course = Course::create([
            'category_id' => $this->category->id,
            'instructor_id' => $this->user->id,
            'title' => 'Legacy Course',
            'slug' => 'legacy-course',
            'status' => 'draft',
        ]);

        $response = $this->actingAs($this->user)->deleteJson("/api/v1/courses/{$course->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('courses', [
            'id' => $course->id,
        ]);
    }
}
