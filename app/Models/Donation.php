<?php

namespace App\Models;

use App\Enums\DonationContentType;
use App\Enums\DonationCurrency;
use App\Enums\DonationStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentProcessor as PaymentProcessorEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

/**
 * @property-read User $streamer
 * @property-read Goal|null $goal
 */
class Donation extends BaseModel
{
    use HasUlids, SoftDeletes;

    public const null UPDATED_AT = null;

    protected $fillable = [
        'streamer_id',
        'goal_id',
        'currency',
        'amount',
        'donor_name',
        'donor_browser_fingerprint',
        'donor_ip_address',
        'donor_id',
        'status',
        'payment_processor',
        'payment_method',
        'payment_id',
        'payment_reference',
        'payment_split_id',
        'content_type',
        'content_text',
        'content_path',
        'approved_at',
        'expires_at',
        'expired_at',
        'in_queue',
        'banned_at',
    ];

    protected $casts = [
        'content_type' => DonationContentType::class,
        'status' => DonationStatus::class,
        'currency' => DonationCurrency::class,
        'payment_method' => PaymentMethod::class,
        'payment_processor' => PaymentProcessorEnum::class,
        'amount' => 'float',
        'created_at' => 'datetime',
        'deleted_at' => 'datetime',
        'approved_at' => 'datetime',
        'expires_at' => 'datetime',
        'expired_at' => 'datetime',
        'in_queue' => 'boolean',
        'banned_at' => 'datetime',
    ];

    /** @return BelongsTo<User, $this> */
    public function streamer(): BelongsTo
    {
        return $this->belongsTo(User::class, foreignKey: 'streamer_id');
    }

    /** @return BelongsTo<User, $this> */
    public function donor(): BelongsTo
    {
        return $this->belongsTo(User::class, foreignKey: 'donor_id');
    }

    /** @return BelongsTo<Goal, $this> */
    public function goal(): BelongsTo
    {
        return $this->belongsTo(Goal::class);
    }

    public function isPending(): bool
    {
        return $this->status === DonationStatus::Pending;
    }

    public function isNotPending(): bool
    {
        return ! $this->isPending();
    }

    public function isApproved(): bool
    {
        return $this->status === DonationStatus::Approved;
    }

    public function isExpired(): bool
    {
        return $this->status === DonationStatus::Expired;
    }

    /** @param Builder<Donation> $query
     * @return Builder<Donation>
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', DonationStatus::Pending);
    }

    /** @param Builder<Donation> $query
     * @return Builder<Donation>
     */
    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('expires_at', '<=', now());
    }

    /** @param Builder<Donation> $query
     * @return Builder<Donation>
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', DonationStatus::Approved);
    }

    /** @param Builder<Donation> $query
     * @return Builder<Donation>
     */
    public function scopeApprovedThirtyDaysAgo(Builder $query): Builder
    {
        return $query->where('approved_at', '>=', now()->subDays(30));
    }

    /** @param Builder<Donation> $query
     * @return Builder<Donation>
     */
    public function scopeExpired(Builder $query): Builder
    {
        return $query->where('status', DonationStatus::Expired);
    }

    /** @param Builder<Donation> $query
     * @return Builder<Donation>
     */
    public function scopeUnplayed(Builder $query): Builder
    {
        return $query->where('in_queue', true);
    }

    public function getContentUrl(): ?string
    {
        if (! $this->content_path) {
            return null;
        }

        return Storage::disk('public')->url($this->content_path);
    }

    protected static function booted(): void
    {
        static::creating(function (self $donation) {
            $donation->fill([
                'status' => DonationStatus::Pending,
            ]);
        });
    }
}
