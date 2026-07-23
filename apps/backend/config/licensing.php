<?php

return [

    /*
    |--------------------------------------------------------------------------
    | PremierByte Licensing Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration options for the official PremierByte Licensing SDK.
    |
    */

    'api_url' => env('PREMIERBYTE_LICENSING_API_URL', 'http://localhost:8000/api/v1'),

    'license_key' => env('PREMIERBYTE_LICENSE_KEY', 'PBLMS-DEMO-LICENSE-KEY'),

    'product_code' => env('PREMIERBYTE_PRODUCT_CODE', 'PREMIERBYTE-LMS'),

    'secret_key' => env('PREMIERBYTE_LICENSING_SECRET_KEY', null),

    'grace_period_days' => (int) env('LICENSING_GRACE_PERIOD_DAYS', 7),

    /*
    |--------------------------------------------------------------------------
    | Premium Feature Flags
    |--------------------------------------------------------------------------
    |
    | List of feature flag keys managed by the PremierByte Platform.
    |
    */
    'features' => [
        'advanced_reports' => 'Advanced Reports',
        'certificates' => 'Certificates',
        'assignments' => 'Assignments',
        'white_label' => 'White Label',
        'api_access' => 'API Access',
        'multi_instructor' => 'Multi-Instructor',
        'organizations' => 'Organizations',
        'custom_branding' => 'Custom Branding',
        'analytics' => 'Analytics',
        'ai_features' => 'AI Features',
    ],

];
