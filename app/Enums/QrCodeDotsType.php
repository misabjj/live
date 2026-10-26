<?php

namespace App\Enums;

enum QrCodeDotsType: string
{
    case Rounded = 'rounded';
    case Dots = 'dots';
    case Classy = 'classy';
    case ClassyRounded = 'classy_rounded';
    case Square = 'square';
    case ExtraRounded = 'extra_rounded';

    public function label(): string
    {
        return match ($this) {
            self::Rounded => 'Arredondado',
            self::Dots => 'Pontos',
            self::Classy => 'Clássico',
            self::ClassyRounded => 'Clássico arredondado',
            self::Square => 'Quadrado',
            self::ExtraRounded => 'Extra arredondado',
        };
    }

    /**
     * Get all dot type options formatted for select inputs.
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
