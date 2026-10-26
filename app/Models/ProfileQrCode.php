<?php

namespace App\Models;

use App\Enums\QrCodeDotsType;
use App\Enums\QrCodeGradientType;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** @property-read User $user */
class ProfileQrCode extends BaseModel
{
    use HasUlids;

    public const null CREATED_AT = null;

    protected $fillable = [
        'user_id',
        'gradient_color_1',
        'gradient_color_2',
        'gradient_type',
        'gradient_rotation',
        'dots_type',
        'text_color',
        'background_color',
        'message',
    ];

    protected function casts(): array
    {
        return [
            'gradient_rotation' => 'integer',
            'gradient_type' => QrCodeGradientType::class,
            'dots_type' => QrCodeDotsType::class,
            'updated_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return array<string, mixed> */
    public static function getDefaults(): array
    {
        return [
            'gradient_color_1' => '#8B5CF6',
            'gradient_color_2' => '#A855F7',
            'gradient_type' => 'linear',
            'gradient_rotation' => 45,
            'dots_type' => 'rounded',
            'text_color' => '#FFFFFF',
            'background_color' => '#080019',
            'message' => null,
        ];
    }
}
