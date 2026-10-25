<?php

namespace App\Models;

use App\Enums\PaymentProcessor as PaymentProcessorEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentProcessor extends BaseModel
{
    use HasUlids;

    public function scopeActive(Builder $query): void
    {
        $query->where('is_active', true);
    }

    public function scopeEfiBank(Builder $query): void
    {
        $query->where('processor', PaymentProcessorEnum::EfiBank->value);
    }

    public function scopeMercadoPago(Builder $query): void
    {
        $query->where('processor', PaymentProcessorEnum::MercadoPago->value);
    }

    protected $table = 'payment_processors';

    protected $fillable = ['user_id', 'processor', 'config', 'webhook_signing_secret', 'is_active'];

    protected $casts = [
        'processor' => PaymentProcessorEnum::class,
        'config' => 'object',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = ['config', 'webhook_signing_secret'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isMercadoPago(): bool
    {
        return $this->processor === PaymentProcessorEnum::MercadoPago;
    }

    public function isEfiBank(): bool
    {
        return $this->processor === PaymentProcessorEnum::EfiBank;
    }

    public function isStripe(): bool
    {
        return $this->processor === PaymentProcessorEnum::Stripe;
    }

    public function supportsPix(): bool
    {
        return $this->isMercadoPago() || $this->isEfiBank();
    }

    public function supportsCreditCard(): bool
    {
        return $this->isStripe();
    }

    public function getTypeDisplayName(): string
    {
        return match ($this->processor) {
            PaymentProcessorEnum::MercadoPago => 'Mercado Pago',
            PaymentProcessorEnum::EfiBank => 'EFI Bank',
            PaymentProcessorEnum::Stripe => 'Stripe',
        };
    }

    public function getPlatformFeePercentage(?string $paymentMethod = null): float
    {
        // If no payment method specified, use default
        if (! $paymentMethod) {
            return config('services.platform.fee_percentage', 10.0);
        }

        // Get specific fee for payment method
        $methodFees = config('services.platform.fees', []);

        // Map payment method to config key
        $configKey = match ($paymentMethod) {
            'pix' => 'pix',
            'card', 'credit_card', 'efi_card', 'mercado_pago_card', 'stripe_card' => 'card',
            default => null
        };

        if ($configKey && isset($methodFees[$configKey])) {
            return (float) $methodFees[$configKey];
        }

        // Fallback to default
        return config('services.platform.fee_percentage', 10.0);
    }

    public function getStreamerPercentage(?string $paymentMethod = null): float
    {
        return 100 - $this->getPlatformFeePercentage($paymentMethod);
    }

    /**
     * Calculate platform fee amount from donation value
     */
    public function calculatePlatformFee(float $amount, ?string $paymentMethod = null): float
    {
        return $amount * ($this->getPlatformFeePercentage($paymentMethod) / 100);
    }

    /**
     * Calculate streamer amount from donation value
     */
    public function calculateStreamerAmount(float $amount, ?string $paymentMethod = null): float
    {
        return $amount - $this->calculatePlatformFee($amount, $paymentMethod);
    }
}
