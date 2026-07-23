<?php

namespace App\Modules\Users\Requests;

use App\Models\User;
use App\Modules\Users\DTOs\CreateUserDTO;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class CreateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('users.create') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'alpha_dash',
                'max:255',
                Rule::unique(User::class),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'phone' => ['nullable', 'string', 'max:50'],
            'password' => [
                'required',
                'string',
                Password::min(12)->letters()->mixedCase()->numbers()->symbols(),
            ],
            'avatar' => ['nullable', 'string', 'max:1000'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'status' => ['required', 'string', 'in:active,pending,suspended'],
            'roles' => ['nullable', 'array'],
            'roles.*' => ['string', 'exists:roles,name'],
        ];
    }

    /**
     * Transform validated payload to CreateUserDTO.
     */
    public function toDTO(): CreateUserDTO
    {
        return CreateUserDTO::fromArray($this->validated());
    }
}
