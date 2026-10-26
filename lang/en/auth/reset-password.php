<?php

return [
    'title' => 'Reset password',
    'subtitle' => 'Please enter your new password below.',
    'fields' => [
        'email' => ['label' => 'Email'],
        'password' => ['label' => 'Password', 'placeholder' => 'Enter your new password'],
        'password_confirmation' => ['label' => 'Confirm password', 'placeholder' => 'Confirm your new password'],
    ],
    'buttons' => ['reset' => 'Reset password'],
];
