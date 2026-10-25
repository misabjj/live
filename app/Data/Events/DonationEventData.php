<?php

namespace App\Data\Events;

use App\Enums\DonationContentType;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class DonationEventData extends Data
{
    public function __construct(
        public string $id,
        public string $donor_name,
        public int|float $amount,
        public string $currency,
        public ?string $content_text,
        public DonationContentType $content_type,
        public ?string $content_url,
        public ?string $speech_text,
        public ?string $voice_id,
    ) {}
}
