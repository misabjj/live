<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DonationRules extends BaseModel
{
    use HasUlids;

    protected $table = 'donation_rules';

    protected $fillable = [
        'user_id',
        'accept_ai_audio',
        'accept_donor_audio',
        'min_amount_text',
        'min_amount_text_to_speech',
        'min_amount_audio',
        'max_characters_text',
        'max_characters_text_to_speech',
        'max_audio_duration',
    ];

    protected function casts(): array
    {
        return [
            'accept_ai_audio' => 'boolean',
            'accept_donor_audio' => 'boolean',
            'min_amount_text' => 'float',
            'min_amount_text_to_speech' => 'float',
            'min_amount_audio' => 'float',
            'max_characters_text' => 'integer',
            'max_characters_text_to_speech' => 'integer',
            'max_audio_duration' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function getDefaults(): array
    {
        return [
            'accept_ai_audio' => true,
            'accept_donor_audio' => true,
            'min_amount_text' => config('platform.donation_min_amount_text'),
            'min_amount_text_to_speech' => config('platform.donation_min_amount_text_to_speech'),
            'min_amount_audio' => config('platform.donation_min_amount_audio'),
            'max_characters_text' => 72,
            'max_characters_text_to_speech' => 72,
            'max_audio_duration' => config('platform.donation_max_audio_duration'),
        ];
    }
}
