<?php

namespace Tests\Feature;

use App\Models\User;
use App\Modules\Licensing\Contracts\LicensingServiceInterface;
use App\Modules\Licensing\DTOs\LicenseStatusDTO;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrganizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('db:seed', ['--class' => 'Database\\Seeders\\RolesAndPermissionsSeeder']);

        // Mock licensing service so feature flag 'organizations' is active
        $mockStatus = new LicenseStatusDTO(
            valid: true,
            status: 'active',
            features: ['organizations' => true]
        );

        $mockService = $this->createMock(LicensingServiceInterface::class);
        $mockService->method('getStatus')->willReturn($mockStatus);
        $mockService->method('hasFeature')->with('organizations')->willReturn(true);

        $this->app->instance(LicensingServiceInterface::class, $mockService);
    }

    public function test_authenticated_admin_can_fetch_organization_profile(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $response = $this->actingAs($admin)->getJson('/api/v1/organization');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.name', 'Premierbyte LMS');
    }

    public function test_authenticated_admin_can_update_organization_profile_and_branding(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole('Administrator');

        $payload = [
            'name' => 'Acme Academy',
            'slug' => 'acme-academy',
            'email' => 'contact@acme.org',
            'phone' => '+15559876543',
            'address' => '500 Tech Boulevard',
            'country' => 'Canada',
            'state' => 'Ontario',
            'city' => 'Toronto',
            'timezone' => 'America/Toronto',
            'locale' => 'en',
            'logo' => 'https://example.com/logo.png',
            'favicon' => 'https://example.com/favicon.ico',
            'primary_color' => '#10b981',
            'secondary_color' => '#6366f1',
            'status' => 'active',
        ];

        $response = $this->actingAs($admin)->putJson('/api/v1/organization', $payload);

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.name', 'Acme Academy');
        $response->assertJsonPath('data.primary_color', '#10b981');

        $this->assertDatabaseHas('organizations', [
            'name' => 'Acme Academy',
            'slug' => 'acme-academy',
            'primary_color' => '#10b981',
        ]);
    }

    public function test_student_cannot_update_organization_settings(): void
    {
        $student = User::factory()->create();
        $student->assignRole('Student');

        $payload = [
            'name' => 'Hacked Name',
            'slug' => 'hacked-name',
            'email' => 'hacker@example.com',
            'timezone' => 'UTC',
            'locale' => 'en',
            'primary_color' => '#000000',
            'secondary_color' => '#111111',
            'status' => 'active',
        ];

        $response = $this->actingAs($student)->putJson('/api/v1/organization', $payload);

        $response->assertStatus(403);
    }
}
