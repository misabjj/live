<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Platform Configuration (Master Config)
    |--------------------------------------------------------------------------
    |
    | Centralized configuration for all platform constraints, limits, and rules
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Donation Rules & Constraints
    |--------------------------------------------------------------------------
    */

    // Minimum amounts per content type
    'donation_min_amount_text' => 1,
    'donation_min_amount_audio' => 1,

    // Maximum characters per content type
    'donation_max_characters_text' => 400,

    // Maximum audio duration in seconds
    'donation_max_audio_duration' => 60, // 1 min

    /*
    |--------------------------------------------------------------------------
    | Platform Fees
    |--------------------------------------------------------------------------
    */

    'fee_percentage' => (float) env('PLATFORM_FEE_PERCENTAGE'),

    /*
    |--------------------------------------------------------------------------
    | Efí Bank
    |--------------------------------------------------------------------------
    */

    'efi_account_number' => env('PLATFORM_EFI_ACCOUNT_NUMBER'),
    'efi_document_number' => env('PLATFORM_EFI_DOCUMENT_NUMBER'),
];
