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
            'gradient_color_1.required' => 'A primeira cor do gradiente é obrigatória.',
            'gradient_color_1.regex' => 'A primeira cor do gradiente deve estar no formato hexadecimal (#RRGGBB).',
            'gradient_color_2.required' => 'A segunda cor do gradiente é obrigatória.',
            'gradient_color_2.regex' => 'A segunda cor do gradiente deve estar no formato hexadecimal (#RRGGBB).',
            'gradient_type.required' => 'O tipo de gradiente é obrigatório.',
            'gradient_type.in' => 'O tipo de gradiente deve ser linear ou radial.',
            'gradient_rotation.required' => 'A rotação do gradiente é obrigatória.',
            'gradient_rotation.integer' => 'A rotação do gradiente deve ser um número inteiro.',
            'gradient_rotation.min' => 'A rotação do gradiente deve ser no mínimo 0 graus.',
            'gradient_rotation.max' => 'A rotação do gradiente deve ser no máximo 360 graus.',
            'dots_type.required' => 'O tipo de pontos é obrigatório.',
            'dots_type.in' => 'O tipo de pontos deve ser um dos valores válidos.',
            'text_color.required' => 'A cor do texto é obrigatória.',
            'text_color.regex' => 'A cor do texto deve estar no formato hexadecimal (#RRGGBB).',
            'background_color.required' => 'A cor de fundo é obrigatória.',
            'background_color.regex' => 'A cor de fundo deve estar no formato hexadecimal (#RRGGBB).',
            'message.max' => 'A mensagem deve ter no máximo 64 caracteres.',
        ];
    }
}
