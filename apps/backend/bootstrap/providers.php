<?php

use App\Modules\Licensing\Providers\LicensingServiceProvider;
use App\Modules\Organizations\Providers\OrganizationServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    LicensingServiceProvider::class,
    OrganizationServiceProvider::class,
];
