<?php

namespace App\Modules\Users\Repositories;

use App\Models\User;
use App\Modules\Users\DTOs\CreateUserDTO;
use App\Modules\Users\DTOs\UpdateUserDTO;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;

class UserRepository implements UserRepositoryInterface
{
    /**
     * Paginate users with optional search and role filtering.
     *
     * @return LengthAwarePaginator<int, User>
     */
    public function paginate(int $perPage = 15, ?string $search = null, ?string $role = null): LengthAwarePaginator
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

        return $query->latest()->paginate($perPage);
    }

    /**
     * Find user by ID.
     */
    public function findById(int $id): User
    {
        return User::with(['roles', 'permissions'])->findOrFail($id);
    }

    /**
     * Create user.
     */
    public function create(CreateUserDTO $dto): User
    {
        $user = User::create([
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
     * Update user by ID.
     */
    public function update(int $id, UpdateUserDTO $dto): User
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
    public function delete(int $id): bool
    {
        $user = $this->findById($id);

        return (bool) $user->delete();
    }
}
