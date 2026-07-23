<?php

namespace App\Modules\Users\Requests;

use App\Modules\Users\DTOs\UpdateUserDTO;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('users.update') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = (int) $this->route('id');

        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'alpha_dash',
                'max:255',
                Rule::unique('users')->ignore($userId),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($userId),
            ],
            'phone' => ['nullable', 'string', 'max:50'],
            'password' => [
                'nullable',
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
     * Transform validated payload to UpdateUserDTO.
     */
    public function toDTO(): UpdateUserDTO
    {
        return UpdateUserDTO::fromArray($this->validated());
    }
}
