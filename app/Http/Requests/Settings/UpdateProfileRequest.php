<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'display_name' => ['required', 'string', 'max:255'],
            'handle' => ['required', 'string', 'max:30', 'regex:/^[a-zA-Z0-9_.-]+$/', 'unique:users,handle,'.$this->user()->id],
            'background_image' => ['nullable', 'image', 'max:5120'],
            'background_color' => ['nullable', 'string', 'regex:/^#[0-9A-F]{6}$/i'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'handle' => strtolower($this->handle),
        ]);
    }
}
