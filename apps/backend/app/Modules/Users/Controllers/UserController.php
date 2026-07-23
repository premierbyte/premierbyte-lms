<?php

namespace App\Modules\Users\Controllers;

use App\Core\BaseController;
use App\Modules\Users\Requests\CreateUserRequest;
use App\Modules\Users\Requests\UpdateUserRequest;
use App\Modules\Users\Resources\UserResource;
use App\Modules\Users\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends BaseController
{
    public function __construct(
        protected UserService $service
    ) {}

    /**
     * List users with search, role, and pagination options.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 15);
        $search = $request->query('search') ? (string) $request->query('search') : null;
        $role = $request->query('role') ? (string) $request->query('role') : null;

        $paginator = $this->service->getUsers($perPage, $search, $role);

        return response()->json([
            'success' => true,
            'message' => 'Users retrieved successfully',
            'data' => UserResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'code' => 200,
        ], 200);
    }

    /**
     * Get specific user profile.
     */
    public function show(int $id): JsonResponse
    {
        $user = $this->service->getUser($id);

        return $this->successResponse(new UserResource($user), 'User retrieved successfully');
    }

    /**
     * Create a new user.
     */
    public function store(CreateUserRequest $request): JsonResponse
    {
        $user = $this->service->createUser($request->toDTO());

        return $this->successResponse(new UserResource($user), 'User created successfully.', 201);
    }

    /**
     * Update user details and roles.
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $user = $this->service->updateUser($id, $request->toDTO());

        return $this->successResponse(new UserResource($user), 'User updated successfully.');
    }

    /**
     * Delete user by ID.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        if (! $request->user()?->can('users.delete')) {
            return $this->errorResponse('Forbidden', 403);
        }

        $this->service->deleteUser($id);

        return $this->successResponse(null, 'User deleted successfully.');
    }

    /**
     * Invite user by email.
     */
    public function invite(Request $request): JsonResponse
    {
        if (! $request->user()?->can('users.create')) {
            return $this->errorResponse('Forbidden', 403);
        }

        $validated = $request->validate([
            'email' => ['required', 'email', 'unique:users,email'],
            'role' => ['required', 'string', 'exists:roles,name'],
        ]);

        $user = $this->service->inviteUser($validated);

        return $this->successResponse(new UserResource($user), 'Invitation sent successfully.', 201);
    }
}
