<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePaymentProcessorRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'processor' => [
                'required',
                'in:mercado_pago,efi_bank,stripe',
            ],
        ];

        // Get the processor type from request
        $processorType = $this->input('processor');

        // All fields are required regardless of create/update operation
        switch ($processorType) {
            case 'mercado_pago':
                $rules['access_token'] = [
                    'required',
                    'string',
                    'regex:/^APP_USR-[a-zA-Z0-9\-]{40,}$/',
                    'min:44',
                ];
                $rules['platform_fee_percentage'] = [
                    'nullable',
                    'numeric',
                    'min:0',
                    'max:100',
                ];
                break;

            case 'efi_bank':
                $rules['client_id'] = ['required', 'string'];
                $rules['client_secret'] = ['required', 'string'];
                $rules['certificate'] = ['required', 'file', 'max:10240'];
                break;

            case 'stripe':
                $rules['secret_key'] = [
                    'required',
                    'string',
                    'regex:/^sk_live_[a-zA-Z0-9]+$/',
                    'min:107',
                ];
                break;
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'processor.required' => __('validation.settings.payment_processors.processor.required'),
            'processor.in' => __('validation.settings.payment_processors.processor.in'),
            'processor.unique' => __('validation.settings.payment_processors.processor.unique'),

            // Mercado Pago messages
            'access_token.required' => 'O token de acesso do Mercado Pago é obrigatório.',
            'access_token.string' => 'O token de acesso deve ser um texto válido.',
            'access_token.regex' => 'O token deve ter o formato válido do Mercado Pago (APP_USR-...). Apenas tokens de produção são permitidos.',
            'access_token.min' => 'O token de acesso deve ter pelo menos 44 caracteres.',

            // EFI Bank messages
            'client_id.required' => __('validation.settings.payment_processors.efi_bank.client_id.required_if'),
            'client_secret.required' => __('validation.settings.payment_processors.efi_bank.client_secret.required_if'),
            'certificate.required' => __('validation.settings.payment_processors.efi_bank.certificate.required_if'),
            'certificate.mimes' => __('validation.settings.payment_processors.efi_bank.certificate.mimes'),

            // Stripe messages
            'secret_key.required' => 'A chave secreta do Stripe é obrigatória.',
            'secret_key.string' => 'A chave secreta deve ser um texto válido.',
            'secret_key.regex' => 'A chave secreta deve ter o formato válido do Stripe (sk_live_...). Apenas chaves de produção são permitidas.',
            'secret_key.min' => 'A chave secreta do Stripe deve ter pelo menos 107 caracteres.',
        ];
    }
}
