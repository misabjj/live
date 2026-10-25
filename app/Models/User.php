<?php

namespace App\Models;

use App\Support\Str;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends BaseModel implements AuthenticatableContract, AuthorizableContract, CanResetPasswordContract
{
    use Authenticatable, Authorizable, CanResetPassword, HasUlids, MustVerifyEmail, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'display_name',
        'email',
        'handle',
        'password',
        'is_admin',
        'profile_photo',
        'background_image',
        'background_color',
        'email_verified_at',
        'verified_at',
        'accepting_donations',
        'queue_paused',
        'provider_id',
        'provider_name',
        'provider_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class, foreignKey: 'streamer_id');
    }

    public function paymentProcessors(): HasMany
    {
        return $this->hasMany(PaymentProcessor::class);
    }

    public function donationRules(): HasOne
    {
        return $this->hasOne(DonationRules::class)->withDefault(DonationRules::getDefaults());
    }

    public function goals(): HasMany
    {
        return $this->hasMany(Goal::class);
    }

    public function widgets(): HasMany
    {
        return $this->hasMany(Widget::class);
    }

    public function profileQrCode(): HasOne
    {
        return $this->hasOne(ProfileQrCode::class)->withDefault(ProfileQrCode::getDefaults());
    }

    public function donationAlertConfiguration(): HasOne
    {
        return $this->hasOne(DonationAlertConfiguration::class)->withDefault(DonationAlertConfiguration::getDefaults());
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'accepting_donations' => 'boolean',
            'queue_paused' => 'boolean',
            'presets' => 'array',
        ];
    }

    public function getProfileUrl(): string
    {
        return route('donate.show', $this->handle);
    }

    public function getShortProfileUrl(): string
    {
        return str_replace('https://', '', $this->getProfileUrl());
    }

    public function getProfilePhotoUrl(): ?string
    {
        if (! $this->profile_photo) {
            return null;
        }

        if (Str::containsHttps($this->profile_photo)) {
            return $this->profile_photo;
        }

        return Storage::disk('public')->url($this->profile_photo);
    }

    public function getBackgroundImageUrl(): ?string
    {
        if (! $this->background_image) {
            return null;
        }

        return Storage::disk('public')->url($this->background_image);
    }
}
