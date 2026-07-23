<?php

namespace App\Modules\Organizations\Requests;

use App\Modules\Organizations\DTOs\OrganizationDTO;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOrganizationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('organizations.update') ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'alpha_dash', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:500'],
            'country' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'city' => ['nullable', 'string', 'max:100'],
            'timezone' => ['required', 'string', 'max:100'],
            'locale' => ['required', 'string', 'max:10'],
            'logo' => ['nullable', 'string', 'max:1000'],
            'favicon' => ['nullable', 'string', 'max:1000'],
            'primary_color' => ['required', 'string', 'regex:/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/'],
            'secondary_color' => ['required', 'string', 'regex:/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/'],
            'status' => ['required', 'string', 'in:active,inactive,suspended'],
        ];
    }

    /**
     * Transform validated payload to OrganizationDTO.
     */
    public function toDTO(): OrganizationDTO
    {
        return OrganizationDTO::fromArray($this->validated());
    }
}
