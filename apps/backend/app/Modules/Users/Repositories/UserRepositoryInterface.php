<?php

namespace App\Modules\Users\Repositories;

use App\Models\User;
use App\Modules\Users\DTOs\CreateUserDTO;
use App\Modules\Users\DTOs\UpdateUserDTO;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface UserRepositoryInterface
{
    /**
     * Paginate users with optional search and role filtering.
     *
     * @return LengthAwarePaginator<int, User>
     */
    public function paginate(int $perPage = 15, ?string $search = null, ?string $role = null): LengthAwarePaginator;

    /**
     * Find user by ID.
     */
    public function findById(int $id): User;

    /**
     * Create user.
     */
    public function create(CreateUserDTO $dto): User;

    /**
     * Update user by ID.
     */
    public function update(int $id, UpdateUserDTO $dto): User;

    /**
     * Delete user by ID.
     */
    public function delete(int $id): bool;
}
