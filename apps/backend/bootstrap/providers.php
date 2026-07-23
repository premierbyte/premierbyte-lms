<?php

use App\Modules\Categories\Providers\CategoryServiceProvider;
use App\Modules\Licensing\Providers\LicensingServiceProvider;
use App\Modules\Organizations\Providers\OrganizationServiceProvider;
use App\Modules\Users\Providers\UserServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    LicensingServiceProvider::class,
    OrganizationServiceProvider::class,
    UserServiceProvider::class,
    CategoryServiceProvider::class,
];
