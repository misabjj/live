<?php

namespace App\Enums;

enum QrCodeGradientType: string
{
    case Linear = 'linear';
    case Radial = 'radial';

    public function label(): string
    {
        return match ($this) {
            self::Linear => 'Linear',
            self::Radial => 'Radial',
        };
    }

    /**
     * Get all gradient type options formatted for select inputs.
     *
     * @return array<int, array{value: string, label: string}>
     */
    public static function options(): array
    {
        return collect(self::cases())->map(fn (self $type) => [
            'value' => $type->value,
            'label' => $type->label(),
        ])->all();
    }
}
