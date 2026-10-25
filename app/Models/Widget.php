<?php

namespace App\Models;

use App\Enums\WidgetType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Widget extends BaseModel
{
    use HasUlids;

    protected $fillable = [
        'user_id',
        'type',
        'token',
    ];

    protected function casts(): array
    {
        return [
            'type' => WidgetType::class,
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Widget $widget) {
            if (! $widget->token) {
                $widget->token = Str::uuid();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function regenerateToken(): void
    {
        $this->update(['token' => Str::uuid()]);
    }

    public function getUrl(): string
    {
        return route('widgets.show', $this->token);
    }

    public function scopeProfileQrCode(Builder $query): void
    {
        $query->where('type', WidgetType::ProfileQrCode);
    }

    public function scopeDonationAlert(Builder $query): void
    {
        $query->where('type', WidgetType::DonationAlert);
    }

    public function scopeGoal(Builder $query): void
    {
        $query->where('type', WidgetType::Goal);
    }
}
