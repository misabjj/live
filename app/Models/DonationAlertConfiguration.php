<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DonationAlertConfiguration extends BaseModel
{
    use HasUlids;

    protected $table = 'donation_alert_configurations';

    protected $fillable = [
        'user_id',
        'primary_color',
        'secondary_color',
        'message_color',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function getDefaults(): array
    {
        return [
            'primary_color' => '#8b5cf6',
            'secondary_color' => '#ec4899',
            'message_color' => '#374151',
        ];
    }
}
