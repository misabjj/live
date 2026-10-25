<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDonationAlertConfigurationRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'primary_color' => ['required', 'string', 'regex:/^#[a-fA-F0-9]{6}$/'],
            'secondary_color' => ['required', 'string', 'regex:/^#[a-fA-F0-9]{6}$/'],
            'message_color' => ['required', 'string', 'regex:/^#[a-fA-F0-9]{6}$/'],
        ];
    }
}
