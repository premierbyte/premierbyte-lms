<?php

namespace App\Modules\Organizations\DTOs;

use App\Core\BaseDTO;

class OrganizationDTO extends BaseDTO
{
    public function __construct(
        public readonly string $name,
        public readonly string $slug,
        public readonly string $email,
        public readonly ?string $phone = null,
        public readonly ?string $address = null,
        public readonly ?string $country = null,
        public readonly ?string $state = null,
        public readonly ?string $city = null,
        public readonly string $timezone = 'UTC',
        public readonly string $locale = 'en',
        public readonly ?string $logo = null,
        public readonly ?string $favicon = null,
        public readonly string $primaryColor = '#4f46e5',
        public readonly string $secondaryColor = '#9333ea',
        public readonly string $status = 'active'
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            name: (string) ($data['name'] ?? ''),
            slug: (string) ($data['slug'] ?? ''),
            email: (string) ($data['email'] ?? ''),
            phone: isset($data['phone']) ? (string) $data['phone'] : null,
            address: isset($data['address']) ? (string) $data['address'] : null,
            country: isset($data['country']) ? (string) $data['country'] : null,
            state: isset($data['state']) ? (string) $data['state'] : null,
            city: isset($data['city']) ? (string) $data['city'] : null,
            timezone: (string) ($data['timezone'] ?? 'UTC'),
            locale: (string) ($data['locale'] ?? 'en'),
            logo: isset($data['logo']) ? (string) $data['logo'] : null,
            favicon: isset($data['favicon']) ? (string) $data['favicon'] : null,
            primaryColor: (string) ($data['primary_color'] ?? '#4f46e5'),
            secondaryColor: (string) ($data['secondary_color'] ?? '#9333ea'),
            status: (string) ($data['status'] ?? 'active')
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'slug' => $this->slug,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'country' => $this->country,
            'state' => $this->state,
            'city' => $this->city,
            'timezone' => $this->timezone,
            'locale' => $this->locale,
            'logo' => $this->logo,
            'favicon' => $this->favicon,
            'primary_color' => $this->primaryColor,
            'secondary_color' => $this->secondaryColor,
            'status' => $this->status,
        ];
    }
}
