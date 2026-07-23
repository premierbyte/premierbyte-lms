<?php

namespace App\Modules\Users\Services;

use App\Models\User;
use App\Modules\Users\DTOs\CreateUserDTO;
use App\Modules\Users\DTOs\UpdateUserDTO;
use App\Modules\Users\Repositories\UserRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserService
{
    public function __construct(
        protected UserRepositoryInterface $repository
    ) {}

    /**
     * Get paginated user list.
     *
     * @return LengthAwarePaginator<int, User>
     */
    public function getUsers(int $perPage = 15, ?string $search = null, ?string $role = null): LengthAwarePaginator
    {
        return $this->repository->paginate($perPage, $search, $role);
    }

    /**
     * Get user details.
     */
    public function getUser(int $id): User
    {
        return $this->repository->findById($id);
    }

    /**
     * Create new user.
     */
    public function createUser(CreateUserDTO $dto): User
    {
        return $this->repository->create($dto);
    }

    /**
     * Update existing user.
     */
    public function updateUser(int $id, UpdateUserDTO $dto): User
    {
        return $this->repository->update($id, $dto);
    }

    /**
     * Delete user.
     */
    public function deleteUser(int $id): bool
    {
        return $this->repository->delete($id);
    }

    /**
     * Invite a new user via email.
     *
     * @param  array<string, mixed>  $data
     */
    public function inviteUser(array $data): User
    {
        $dto = new CreateUserDTO(
            firstName: (string) ($data['first_name'] ?? 'Invited'),
            lastName: (string) ($data['last_name'] ?? 'User'),
            username: (string) ($data['username'] ?? 'user_'.time()),
            email: (string) ($data['email'] ?? ''),
            password: 'Password123!!', // Temporary password
            phone: null,
            avatar: null,
            bio: null,
            status: 'pending',
            roles: isset($data['role']) ? [(string) $data['role']] : ['Student']
        );

        return $this->createUser($dto);
    }
}
