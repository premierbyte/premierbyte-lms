<?php

namespace App\Modules\Licensing\Middleware;

use App\Modules\Licensing\Contracts\LicensingServiceInterface;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureFeatureEnabled
{
    public function __construct(
        protected LicensingServiceInterface $licensingService
    ) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $featureKey): Response
    {
        if (! $this->licensingService->hasFeature($featureKey)) {
            return response()->json([
                'success' => false,
                'message' => "The required premium feature '{$featureKey}' is not active or enabled under your current license.",
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}
