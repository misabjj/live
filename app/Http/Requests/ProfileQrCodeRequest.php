<?php

namespace App\Http\Requests;

use App\Enums\QrCodeDotsType;
use App\Enums\QrCodeGradientType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileQrCodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'gradient_color_1' => 'required|string|size:7|regex:/^#[0-9A-Fa-f]{6}$/',
            'gradient_color_2' => 'required|string|size:7|regex:/^#[0-9A-Fa-f]{6}$/',
            'gradient_type' => ['required', Rule::enum(QrCodeGradientType::class)],
            'gradient_rotation' => 'required|integer|min:0|max:360',
            'dots_type' => ['required', Rule::enum(QrCodeDotsType::class)],
            'text_color' => 'required|string|size:7|regex:/^#[0-9A-Fa-f]{6}$/',
            'background_color' => 'required|string|size:7|regex:/^#[0-9A-Fa-f]{6}$/',
            'message' => 'nullable|string|max:64',
        ];
    }

    public function messages(): array
    {
        return [
            'gradient_color_1.required' => __('validation.forms.profile_qr_code.gradient_color_1.required'),
            'gradient_color_1.regex' => __('validation.forms.profile_qr_code.gradient_color_1.regex'),
            'gradient_color_2.required' => __('validation.forms.profile_qr_code.gradient_color_2.required'),
            'gradient_color_2.regex' => __('validation.forms.profile_qr_code.gradient_color_2.regex'),
            'gradient_type.required' => __('validation.forms.profile_qr_code.gradient_type.required'),
            'gradient_type.enum' => __('validation.forms.profile_qr_code.gradient_type.enum'),
            'gradient_rotation.required' => __('validation.forms.profile_qr_code.gradient_rotation.required'),
            'gradient_rotation.integer' => __('validation.forms.profile_qr_code.gradient_rotation.integer'),
            'gradient_rotation.min' => __('validation.forms.profile_qr_code.gradient_rotation.min'),
            'gradient_rotation.max' => __('validation.forms.profile_qr_code.gradient_rotation.max'),
            'dots_type.required' => __('validation.forms.profile_qr_code.dots_type.required'),
            'dots_type.enum' => __('validation.forms.profile_qr_code.dots_type.enum'),
            'text_color.required' => __('validation.forms.profile_qr_code.text_color.required'),
            'text_color.regex' => __('validation.forms.profile_qr_code.text_color.regex'),
            'background_color.required' => __('validation.forms.profile_qr_code.background_color.required'),
            'background_color.regex' => __('validation.forms.profile_qr_code.background_color.regex'),
            'message.max' => __('validation.forms.profile_qr_code.message.max'),
        ];
    }
}
