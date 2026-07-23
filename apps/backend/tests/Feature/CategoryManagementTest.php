<?php

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Categories\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('db:seed', ['--class' => 'Database\\Seeders\\RolesAndPermissionsSeeder']);
    }

    public function test_admin_can_create_root_and_sub_categories(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        // 1. Create Root Category
        $rootPayload = [
            'name' => 'Web Development',
            'slug' => 'web-development',
            'description' => 'Courses about modern web development',
            'status' => 'active',
            'sort_order' => 1,
        ];

        $rootResponse = $this->actingAs($admin)->postJson('/api/v1/categories', $rootPayload);
        $rootResponse->assertStatus(201);
        $rootResponse->assertJsonPath('data.name', 'Web Development');

        $rootId = $rootResponse->json('data.id');

        // 2. Create Sub Category
        $subPayload = [
            'name' => 'React & Next.js',
            'slug' => 'react-nextjs',
            'parent_id' => $rootId,
            'description' => 'Frontend frameworks',
            'status' => 'active',
            'sort_order' => 2,
        ];

        $subResponse = $this->actingAs($admin)->postJson('/api/v1/categories', $subPayload);
        $subResponse->assertStatus(201);
        $subResponse->assertJsonPath('data.parent_id', $rootId);
    }

    public function test_admin_can_fetch_category_tree(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $parent = Category::create([
            'name' => 'Data Science',
            'slug' => 'data-science',
            'status' => 'active',
            'sort_order' => 1,
        ]);

        Category::create([
            'parent_id' => $parent->id,
            'name' => 'Machine Learning',
            'slug' => 'machine-learning',
            'status' => 'active',
            'sort_order' => 1,
        ]);

        $response = $this->actingAs($admin)->getJson('/api/v1/categories?mode=tree');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.0.name', 'Data Science');
        $response->assertJsonPath('data.0.children.0.name', 'Machine Learning');
    }

    public function test_category_cannot_be_set_as_its_own_parent(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $category = Category::create([
            'name' => 'Design',
            'slug' => 'design',
            'status' => 'active',
            'sort_order' => 1,
        ]);

        $payload = [
            'name' => 'Design',
            'slug' => 'design',
            'parent_id' => $category->id,
            'status' => 'active',
        ];

        $response = $this->actingAs($admin)->putJson("/api/v1/categories/{$category->id}", $payload);

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'A category cannot be its own parent.');
    }

    public function test_admin_can_reorder_categories(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $cat1 = Category::create(['name' => 'Cat 1', 'slug' => 'cat-1', 'sort_order' => 10]);
        $cat2 = Category::create(['name' => 'Cat 2', 'slug' => 'cat-2', 'sort_order' => 20]);

        $reorderPayload = [
            'items' => [
                ['id' => $cat1->id, 'sort_order' => 50],
                ['id' => $cat2->id, 'sort_order' => 5],
            ],
        ];

        $response = $this->actingAs($admin)->postJson('/api/v1/categories/reorder', $reorderPayload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('categories', ['id' => $cat1->id, 'sort_order' => 50]);
        $this->assertDatabaseHas('categories', ['id' => $cat2->id, 'sort_order' => 5]);
    }

    public function test_admin_can_delete_category(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $category = Category::create(['name' => 'To Delete', 'slug' => 'to-delete']);

        $response = $this->actingAs($admin)->deleteJson("/api/v1/categories/{$category->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
