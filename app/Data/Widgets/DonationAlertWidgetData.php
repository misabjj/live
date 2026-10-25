<?php

namespace App\Data\Widgets;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class DonationAlertWidgetData extends Data
{
    public function __construct(
        public string $token,
        public DonationAlertConfigurationData $configuration,
    ) {}
}
