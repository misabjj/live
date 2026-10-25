<?php

use App\Support\SupertonicVoice;

it('defines previews for every bundled Supertonic voice', function () {
    $voices = SupertonicVoice::all();

    expect($voices)->toHaveCount(10)
        ->and(array_column($voices, 'voice_id'))->toBe([
            'M1', 'M2', 'M3', 'M4', 'M5',
            'F1', 'F2', 'F3', 'F4', 'F5',
        ])
        ->and($voices[2]['name'])->toBe('M3 - Robert');

    foreach ($voices as $voice) {
        expect($voice['voice_preview_path'])->toEndWith(strtolower($voice['voice_id']).'.wav')
            ->and($voice['is_active'])->toBeTrue();
    }
});
