<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles and permissions
        $this->artisan('db:seed', ['--class' => 'Database\\Seeders\\RolesAndPermissionsSeeder']);
    }

    public function test_user_can_register_via_api(): void
    {
        $response = $this->postJson('/api/v1/register', [
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'username' => 'janedoe',
            'email' => 'jane@example.com',
            'phone' => '+15551234567',
            'password' => 'Password123!!',
            'password_confirmation' => 'Password123!!',
        ]);

        $response->assertStatus(201); // Created (or 200 depending on fortify)
        $this->assertDatabaseHas('users', [
            'email' => 'jane@example.com',
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'username' => 'janedoe',
        ]);

        $user = User::where('email', 'jane@example.com')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasRole('Student'));
    }

    public function test_user_registration_validation_enforces_rules(): void
    {
        $response = $this->postJson('/api/v1/register', [
            'first_name' => '',
            'last_name' => '',
            'username' => 'invalid name',
            'email' => 'not-an-email',
            'password' => 'short',
            'password_confirmation' => 'mismatch',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['first_name', 'last_name', 'username', 'email', 'password']);
    }

    public function test_user_can_login_via_api(): void
    {
        $user = User::factory()->create([
            'email' => 'john@example.com',
            'password' => Hash::make('Password123!!'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => 'john@example.com',
            'password' => 'Password123!!',
        ]);

        $response->assertStatus(200);
        $this->assertAuthenticatedAs($user);
    }

    public function test_authenticated_user_can_fetch_profile_via_me_endpoint(): void
    {
        $user = User::factory()->create([
            'first_name' => 'Alice',
            'last_name' => 'Smith',
            'username' => 'alicesmith',
            'email' => 'alice@example.com',
        ]);
        $user->assignRole('Instructor');

        $response = $this->actingAs($user)->getJson('/api/v1/auth/me');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.first_name', 'Alice');
        $response->assertJsonPath('data.last_name', 'Smith');
        $response->assertJsonPath('data.name', 'Alice Smith');
        $response->assertJsonPath('data.username', 'alicesmith');
        $response->assertJsonPath('data.email', 'alice@example.com');
        $response->assertJsonFragment(['Instructor']);
    }

    public function test_unauthenticated_user_cannot_access_me_endpoint(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401);
    }
}
