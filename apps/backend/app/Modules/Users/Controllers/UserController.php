<?php

namespace App\Modules\Users\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Users\Requests\CreateUserRequest;
use App\Modules\Users\Requests\UpdateUserRequest;
use App\Modules\Users\Resources\UserResource;
use App\Modules\Users\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
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
            'data' => UserResource::collection($paginator->items()),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    /**
     * Get specific user profile.
     */
    public function show(int $id): JsonResponse
    {
        $user = $this->service->getUser($id);

        return response()->json([
            'success' => true,
            'data' => new UserResource($user),
        ]);
    }

    /**
     * Create a new user.
     */
    public function store(CreateUserRequest $request): JsonResponse
    {
        $user = $this->service->createUser($request->toDTO());

        return response()->json([
            'success' => true,
            'message' => 'User created successfully.',
            'data' => new UserResource($user),
        ], 201);
    }

    /**
     * Update user details and roles.
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $user = $this->service->updateUser($id, $request->toDTO());

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'data' => new UserResource($user),
        ]);
    }

    /**
     * Delete user by ID.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        if (! $request->user()?->can('users.delete')) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $this->service->deleteUser($id);

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.',
        ]);
    }

    /**
     * Invite user by email.
     */
    public function invite(Request $request): JsonResponse
    {
        if (! $request->user()?->can('users.create')) {
            return response()->json(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'email' => ['required', 'email', 'unique:users,email'],
            'role' => ['required', 'string', 'exists:roles,name'],
        ]);

        $user = $this->service->inviteUser($validated);

        return response()->json([
            'success' => true,
            'message' => 'Invitation sent successfully.',
            'data' => new UserResource($user),
        ], 201);
    }
}
