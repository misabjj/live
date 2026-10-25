<?php

namespace App\Support;

class SupertonicVoice
{
    public const array VOICES = [
        ['voice_id' => 'M1', 'name' => 'M1 - Alex'],
        ['voice_id' => 'M2', 'name' => 'M2 - James'],
        ['voice_id' => 'M3', 'name' => 'M3 - Robert'],
        ['voice_id' => 'M4', 'name' => 'M4 - Sam'],
        ['voice_id' => 'M5', 'name' => 'M5 - Daniel'],
        ['voice_id' => 'F1', 'name' => 'F1 - Sarah'],
        ['voice_id' => 'F2', 'name' => 'F2 - Lily'],
        ['voice_id' => 'F3', 'name' => 'F3 - Jessica'],
        ['voice_id' => 'F4', 'name' => 'F4 - Olivia'],
        ['voice_id' => 'F5', 'name' => 'F5 - Emily'],
    ];

    public static function all(): array
    {
        return array_map(fn (array $voice) => [
            ...$voice,
            'image_path' => null,
            'voice_preview_path' => '/audio/narrators/supertonic/'.strtolower($voice['voice_id']).'.wav',
            'is_active' => true,
        ], self::VOICES);
    }
}
