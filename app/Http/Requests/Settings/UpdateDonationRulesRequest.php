<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDonationRulesRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'accept_ai_audio' => ['required', 'boolean'],
            'accept_donor_audio' => ['required', 'boolean'],
            'min_amount_text' => ['required', 'numeric', 'min:1.00'],
            'min_amount_text_to_speech' => ['required', 'numeric', 'min:3.00'],
            'min_amount_audio' => ['required', 'numeric', 'min:1.00'],
            'max_characters_text' => ['required', 'integer', 'min:1', 'max:'.config('platform.donation_max_characters_text')],
            'max_characters_text_to_speech' => ['required', 'integer', 'min:1', 'max:'.config('platform.donation_max_characters_text_to_speech')],
            'max_audio_duration' => ['required', 'integer', 'min:1', 'max:'.config('platform.donation_max_audio_duration')],
        ];
    }
}
