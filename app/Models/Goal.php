<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/** @property-read User $user */
class Goal extends BaseModel
{
    use HasUlids;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'background_color',
        'progress_bar_color',
        'text_color',
        'meta_info_color',
        'target_amount',
        'raised_amount',
        'closes_at',
        'expires_at',
        'show_url',
        'show_profile_link',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'target_amount' => 'decimal:2',
            'raised_amount' => 'decimal:2',
            'closes_at' => 'datetime',
            'show_url' => 'boolean',
            'show_profile_link' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<Donation, $this> */
    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }

    /** @param Builder<Goal> $query
     * @return Builder<Goal>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function getProgressPercentage(): float
    {
        $target = (float) $this->target_amount;
        if ($target === 0.0) {
            return 0;
        }

        $raised = (float) $this->raised_amount;

        return min(100, max(0, ($raised / $target) * 100));
    }

    public function hasClosed(): bool
    {
        return $this->closes_at->isPast();
    }

    public function isReached(): bool
    {
        return (float) $this->raised_amount >= (float) $this->target_amount;
    }

    /** @return array<string, mixed> */
    public static function getDefaults(): array
    {
        return [
            'background_color' => '#10002B',
            'progress_bar_color' => '#AB81FD',
            'text_color' => '#FFFFFF',
            'show_profile_link' => false,
        ];
    }
}
