<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('db:seed', ['--class' => 'Database\\Seeders\\RolesAndPermissionsSeeder']);
    }

    public function test_authenticated_admin_can_list_users_with_pagination(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        User::factory()->count(20)->create();

        $response = $this->actingAs($admin)->getJson('/api/v1/users?per_page=10');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('meta.per_page', 10);
        $response->assertJsonPath('meta.total', 21);
    }

    public function test_admin_can_filter_users_by_role_and_search(): void
    {
        $admin = User::factory()->create(['first_name' => 'AdminUser']);
        $admin->assignRole('Administrator');

        $instructor = User::factory()->create(['first_name' => 'SpecialInstructor']);
        $instructor->assignRole('Instructor');

        $student = User::factory()->create(['first_name' => 'NormalStudent']);
        $student->assignRole('Student');

        // Filter by role
        $responseRole = $this->actingAs($admin)->getJson('/api/v1/users?role=Instructor');
        $responseRole->assertStatus(200);
        $responseRole->assertJsonFragment(['first_name' => 'SpecialInstructor']);
        $responseRole->assertJsonMissing(['first_name' => 'NormalStudent']);

        // Search query
        $responseSearch = $this->actingAs($admin)->getJson('/api/v1/users?search=SpecialInstructor');
        $responseSearch->assertStatus(200);
        $responseSearch->assertJsonFragment(['first_name' => 'SpecialInstructor']);
    }

    public function test_admin_can_create_new_user_with_role(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $payload = [
            'first_name' => 'Bob',
            'last_name' => 'Teacher',
            'username' => 'bobteacher',
            'email' => 'bob@academy.org',
            'password' => 'Password123!!',
            'status' => 'active',
            'roles' => ['Instructor'],
        ];

        $response = $this->actingAs($admin)->postJson('/api/v1/users', $payload);

        $response->assertStatus(201);
        $response->assertJsonPath('data.first_name', 'Bob');

        $this->assertDatabaseHas('users', ['email' => 'bob@academy.org']);

        $bob = User::where('email', 'bob@academy.org')->first();
        $this->assertNotNull($bob);
        $this->assertTrue($bob->hasRole('Instructor'));
    }

    public function test_admin_can_update_user_profile_and_roles(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $targetUser = User::factory()->create([
            'first_name' => 'Old',
            'last_name' => 'Name',
            'username' => 'old_name',
        ]);
        $targetUser->assignRole('Student');

        $payload = [
            'first_name' => 'Updated',
            'last_name' => 'Name',
            'username' => $targetUser->username,
            'email' => $targetUser->email,
            'status' => 'active',
            'roles' => ['Instructor'],
        ];

        $response = $this->actingAs($admin)->putJson("/api/v1/users/{$targetUser->id}", $payload);

        $response->assertStatus(200);
        $response->assertJsonPath('data.first_name', 'Updated');

        $targetUser->refresh();
        $this->assertTrue($targetUser->hasRole('Instructor'));
    }

    public function test_admin_can_invite_user(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $response = $this->actingAs($admin)->postJson('/api/v1/users/invite', [
            'email' => 'invited@school.edu',
            'role' => 'Instructor',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'invited@school.edu', 'status' => 'pending']);
    }

    public function test_admin_can_delete_user(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $targetUser = User::factory()->create();

        $response = $this->actingAs($admin)->deleteJson("/api/v1/users/{$targetUser->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $targetUser->id]);
    }

    public function test_student_cannot_list_or_create_users(): void
    {
        $student = User::factory()->create();
        $student->assignRole('Student');

        $responseIndex = $this->actingAs($student)->getJson('/api/v1/users');
        $responseIndex->assertStatus(403);

        $responseStore = $this->actingAs($student)->postJson('/api/v1/users', [
            'first_name' => 'Hacker',
            'last_name' => 'User',
            'username' => 'hackeruser',
            'email' => 'hacker@test.com',
            'password' => 'Password123!!',
            'status' => 'active',
        ]);
        $responseStore->assertStatus(403);
    }
}
