<?php

namespace App\Data\Events;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class DonationAlertConfigurationUpdatedEventData extends Data
{
    public function __construct(
        public string $primary_color,
        public string $secondary_color,
        public string $message_color,
    ) {}
}
