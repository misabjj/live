<?php

namespace App\Data\Widgets;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class DonationAlertConfigurationData extends Data
{
    public function __construct(
        public string $primary_color,
        public string $secondary_color,
        public string $message_color,
    ) {}
}
