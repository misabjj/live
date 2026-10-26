<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GoalRequest extends FormRequest
{
    /** @return array<string, mixed> */
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
            'title.required' => __('validation.forms.goal.title.required'),
            'title.min' => __('validation.forms.goal.title.min'),
            'title.max' => __('validation.forms.goal.title.max'),

            'target_amount.required' => __('validation.forms.goal.target_amount.required'),
            'target_amount.numeric' => __('validation.forms.goal.target_amount.numeric'),
            'target_amount.min' => __('validation.forms.goal.target_amount.min'),
            'target_amount.decimal' => __('validation.forms.goal.target_amount.decimal'),

            'raised_amount.numeric' => __('validation.forms.goal.raised_amount.numeric'),
            'raised_amount.min' => __('validation.forms.goal.raised_amount.min'),
            'raised_amount.decimal' => __('validation.forms.goal.raised_amount.decimal'),

            'closes_at.required' => __('validation.forms.goal.closes_at.required'),
            'closes_at.date' => __('validation.forms.goal.closes_at.date'),
            'closes_at.after' => __('validation.forms.goal.closes_at.after'),

            'background_color.required' => __('validation.forms.goal.background_color.required'),
            'background_color.regex' => __('validation.forms.goal.background_color.regex'),

            'progress_bar_color.required' => __('validation.forms.goal.progress_bar_color.required'),
            'progress_bar_color.regex' => __('validation.forms.goal.progress_bar_color.regex'),

            'text_color.required' => __('validation.forms.goal.text_color.required'),
            'text_color.regex' => __('validation.forms.goal.text_color.regex'),

            'show_profile_link.boolean' => __('validation.forms.goal.show_profile_link.boolean'),
        ];
    }
}
