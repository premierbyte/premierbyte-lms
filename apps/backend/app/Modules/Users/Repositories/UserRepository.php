<?php

namespace App\Modules\Users\Repositories;

use App\Core\BaseRepository;
use App\Models\User;
use App\Modules\Users\DTOs\CreateUserDTO;
use App\Modules\Users\DTOs\UpdateUserDTO;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

/**
 * @extends BaseRepository<User>
 */
class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    protected string $modelClass = User::class;

    /**
     * Paginate users with optional search and role filtering.
     *
     * @return LengthAwarePaginator<int, User>
     */
    public function paginateFiltered(int $perPage = 15, ?string $search = null, ?string $role = null): LengthAwarePaginator
    {
        $query = User::query()->with('roles');

        if ($search !== null && $search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role !== null && $role !== '') {
            $query->role($role);
        }

        /** @var LengthAwarePaginator<int, User> $result */
        $result = $query->latest()->paginate($perPage);

        return $result;
    }

    /**
     * Find user by ID.
     */
    public function findById(int $id): User
    {
        /** @var User $user */
        $user = User::with(['roles', 'permissions'])->findOrFail($id);

        return $user;
    }

    /**
     * Create user from DTO.
     */
    public function createUser(CreateUserDTO $dto): User
    {
        /** @var User $user */
        $user = $this->create([
            'first_name' => $dto->firstName,
            'last_name' => $dto->lastName,
            'username' => $dto->username,
            'email' => $dto->email,
            'phone' => $dto->phone,
            'avatar' => $dto->avatar,
            'bio' => $dto->bio,
            'status' => $dto->status,
            'password' => Hash::make($dto->password),
        ]);

        if (! empty($dto->roles)) {
            $user->syncRoles($dto->roles);
        }

        return $user;
    }

    /**
     * Update user by ID from DTO.
     */
    public function updateUser(int $id, UpdateUserDTO $dto): User
    {
        $user = $this->findById($id);

        $payload = [
            'first_name' => $dto->firstName,
            'last_name' => $dto->lastName,
            'username' => $dto->username,
            'email' => $dto->email,
            'phone' => $dto->phone,
            'avatar' => $dto->avatar,
            'bio' => $dto->bio,
            'status' => $dto->status,
        ];

        if ($dto->password !== null && $dto->password !== '') {
            $payload['password'] = Hash::make($dto->password);
        }

        $user->update($payload);

        if (! empty($dto->roles)) {
            $user->syncRoles($dto->roles);
        }

        return $user;
    }

    /**
     * Delete user by ID.
     */
    public function deleteUser(int $id): bool
    {
        return $this->delete($id);
    }
}
