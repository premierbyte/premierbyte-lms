<?php

declare(strict_types=1);

namespace App\Core;

use App\Core\Contracts\ResponseInterface;
use App\Core\Traits\ApiResponse;

abstract class BaseController implements ResponseInterface
{
    use ApiResponse;
}
