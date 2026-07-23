<?php

use App\Modules\Categories\Providers\CategoryServiceProvider;
use App\Modules\Courses\Providers\CourseServiceProvider;
use App\Modules\Licensing\Providers\LicensingServiceProvider;
use App\Modules\Organizations\Providers\OrganizationServiceProvider;
use App\Modules\Users\Providers\UserServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;
use App\Providers\ModuleServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    ModuleServiceProvider::class,
    LicensingServiceProvider::class,
    OrganizationServiceProvider::class,
    UserServiceProvider::class,
    CategoryServiceProvider::class,
    CourseServiceProvider::class,
];
