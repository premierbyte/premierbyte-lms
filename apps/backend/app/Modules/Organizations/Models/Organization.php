<?php

namespace App\Modules\Organizations\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'name',
    'slug',
    'email',
    'phone',
    'address',
    'country',
    'state',
    'city',
    'timezone',
    'locale',
    'logo',
    'favicon',
    'primary_color',
    'secondary_color',
    'status',
])]
class Organization extends Model
{

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}
