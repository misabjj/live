<?php

namespace App\Data\Events;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class DonationAlertEventData extends Data
{
    public function __construct(
        public DonationEventData $donation,
        public bool $force_play = false,
    ) {}
}
