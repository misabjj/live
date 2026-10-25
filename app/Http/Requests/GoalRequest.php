<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GoalRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'min:1',
                'max:255',
            ],
            'target_amount' => [
                'required',
                'numeric',
                'min:0.01',
                'decimal:0,2',
            ],
            'raised_amount' => [
                'nullable',
                'numeric',
                'min:0',
                'decimal:0,2',
            ],
            'closes_at' => [
                'required',
                'date',
                'after:now',
            ],
            'background_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'progress_bar_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'text_color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],
            'show_profile_link' => [
                'nullable',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Título da meta é obrigatório.',
            'title.min' => 'Título deve ter pelo menos 1 caractere.',
            'title.max' => 'Título não pode exceder 255 caracteres.',

            'target_amount.required' => 'Valor meta é obrigatório.',
            'target_amount.numeric' => 'Valor meta deve ser um número válido.',
            'target_amount.min' => 'Valor meta deve ser maior que 0.',
            'target_amount.decimal' => 'Valor meta deve ter no máximo 2 casas decimais.',

            'raised_amount.numeric' => 'Valor arrecadado deve ser um número válido.',
            'raised_amount.min' => 'Valor arrecadado deve ser maior ou igual a 0.',
            'raised_amount.decimal' => 'Valor arrecadado deve ter no máximo 2 casas decimais.',

            'closes_at.required' => 'Data de encerramento é obrigatória.',
            'closes_at.date_format' => 'Data de encerramento deve estar em formato válido.',
            'closes_at.after' => 'Data de encerramento deve ser no futuro.',

            'background_color.required' => 'Cor de fundo é obrigatória.',
            'background_color.regex' => 'Cor de fundo deve ser uma cor hexadecimal válida.',

            'progress_bar_color.required' => 'Cor da barra é obrigatória.',
            'progress_bar_color.regex' => 'Cor da barra deve ser uma cor hexadecimal válida.',

            'text_color.required' => 'Cor do texto é obrigatório.',
            'text_color.regex' => 'Cor do texto deve ser uma cor hexadecimal válida.',

            'show_profile_link.boolean' => 'Mostrar link do perfil deve ser verdadeiro ou falso.',
        ];
    }
}
