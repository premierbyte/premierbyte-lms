<?php

namespace App\Modules\Users\DTOs;

class CreateUserDTO
{
    /**
     * @param  array<int, string>  $roles
     */
    public function __construct(
        public readonly string $firstName,
        public readonly string $lastName,
        public readonly string $username,
        public readonly string $email,
        public readonly string $password,
        public readonly ?string $phone = null,
        public readonly ?string $avatar = null,
        public readonly ?string $bio = null,
        public readonly string $status = 'active',
        public readonly array $roles = ['Student']
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            firstName: (string) ($data['first_name'] ?? ''),
            lastName: (string) ($data['last_name'] ?? ''),
            username: (string) ($data['username'] ?? ''),
            email: (string) ($data['email'] ?? ''),
            password: (string) ($data['password'] ?? ''),
            phone: isset($data['phone']) ? (string) $data['phone'] : null,
            avatar: isset($data['avatar']) ? (string) $data['avatar'] : null,
            bio: isset($data['bio']) ? (string) $data['bio'] : null,
            status: (string) ($data['status'] ?? 'active'),
            roles: isset($data['roles']) && is_array($data['roles']) ? array_values(array_map('strval', $data['roles'])) : ['Student']
        );
    }
}
