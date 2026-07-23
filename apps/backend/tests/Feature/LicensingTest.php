<?php

namespace Tests\Feature;

use App\Modules\Licensing\Contracts\LicensingServiceInterface;
use App\Modules\Licensing\DTOs\LicenseStatusDTO;
use App\Modules\Licensing\Middleware\EnsureFeatureEnabled;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class LicensingTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_fetch_licensing_status_endpoint(): void
    {
        $mockStatus = new LicenseStatusDTO(
            valid: true,
            status: 'active',
            expiresAt: '2030-01-01',
            plan: ['name' => 'Enterprise'],
            features: ['advanced_reports' => true, 'certificates' => true],
            inRestrictedMode: false,
            message: 'Active license'
        );

        $mockService = $this->createMock(LicensingServiceInterface::class);
        $mockService->method('getStatus')->willReturn($mockStatus);

        $this->app->instance(LicensingServiceInterface::class, $mockService);

        $response = $this->getJson('/api/v1/licensing/status');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.valid', true);
        $response->assertJsonPath('data.status', 'active');
        $response->assertJsonPath('data.features.advanced_reports', true);
    }

    public function test_can_fetch_licensing_features_endpoint(): void
    {
        $mockStatus = new LicenseStatusDTO(
            valid: true,
            status: 'active',
            expiresAt: '2030-01-01',
            plan: ['name' => 'Pro'],
            features: ['white_label' => true, 'ai_features' => false],
            inRestrictedMode: false
        );

        $mockService = $this->createMock(LicensingServiceInterface::class);
        $mockService->method('getStatus')->willReturn($mockStatus);

        $this->app->instance(LicensingServiceInterface::class, $mockService);

        $response = $this->getJson('/api/v1/licensing/features');

        $response->assertStatus(200);
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('data.features.white_label', true);
        $response->assertJsonPath('data.features.ai_features', false);
    }

    public function test_ensure_feature_enabled_middleware_blocks_disabled_features(): void
    {
        Route::middleware(['api', EnsureFeatureEnabled::class.':ai_features'])
            ->get('/api/v1/test-ai', fn () => response()->json(['success' => true]));

        $mockService = $this->createMock(LicensingServiceInterface::class);
        $mockService->method('hasFeature')->with('ai_features')->willReturn(false);

        $this->app->instance(LicensingServiceInterface::class, $mockService);

        $response = $this->getJson('/api/v1/test-ai');

        $response->assertStatus(403);
        $response->assertJsonPath('success', false);
    }

    public function test_licensing_sync_artisan_command(): void
    {
        $mockStatus = new LicenseStatusDTO(
            valid: true,
            status: 'active',
            expiresAt: '2030-01-01',
            plan: ['name' => 'Enterprise'],
            features: ['analytics' => true],
            inRestrictedMode: false
        );

        $mockService = $this->createMock(LicensingServiceInterface::class);
        $mockService->method('sync')->willReturn($mockStatus);

        $this->app->instance(LicensingServiceInterface::class, $mockService);

        $this->artisan('licensing:sync')
            ->assertExitCode(0);
    }
}
