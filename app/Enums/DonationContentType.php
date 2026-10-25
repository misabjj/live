<?php

namespace App\Enums;

enum DonationContentType: string
{
    case Text = 'text';
    case TextToSpeech = 'text_to_speech';
    case Audio = 'audio';
}
