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
            'processor.required' => __('validation.forms.payment_processor.processor.required'),
            'processor.in' => __('validation.forms.payment_processor.processor.in'),
            'processor.unique' => __('validation.forms.payment_processor.processor.unique'),

            // Mercado Pago messages
            'access_token.required' => __('validation.forms.payment_processor.access_token.required'),
            'access_token.string' => __('validation.forms.payment_processor.access_token.string'),
            'access_token.regex' => __('validation.forms.payment_processor.access_token.regex'),
            'access_token.min' => __('validation.forms.payment_processor.access_token.min'),

            // EFI Bank messages
            'client_id.required' => __('validation.forms.payment_processor.client_id.required'),
            'client_secret.required' => __('validation.forms.payment_processor.client_secret.required'),
            'certificate.required' => __('validation.forms.payment_processor.certificate.required'),
            'certificate.mimes' => __('validation.forms.payment_processor.certificate.mimes'),

            // Stripe messages
            'secret_key.required' => __('validation.forms.payment_processor.secret_key.required'),
            'secret_key.string' => __('validation.forms.payment_processor.secret_key.string'),
            'secret_key.regex' => __('validation.forms.payment_processor.secret_key.regex'),
            'secret_key.min' => __('validation.forms.payment_processor.secret_key.min'),
        ];
    }
}
