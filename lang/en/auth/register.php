<?php

return [
    'title' => 'Create account',
    'subtitle' => 'Sign up to get started on our platform.',
    'password_requirement' => 'Must be at least 8 characters long',
    'signin_prompt' => 'Already have an account?',
    'fields' => [
        'display_name' => [
            'label' => 'Display name',
            'placeholder' => 'Enter your name',
        ],
        'email' => [
            'label' => 'Email',
            'placeholder' => 'Enter your email',
        ],
        'password' => [
            'label' => 'Password',
            'placeholder' => 'Enter your password',
        ],
        'password_confirmation' => [
            'label' => 'Confirm password',
            'placeholder' => 'Confirm your password',
        ],
    ],
    'buttons' => [
        'register' => 'Create account',
        'processing' => 'Creating account...',
        'login' => 'Already have an account? Sign in',
    ],
];
