<?php

namespace App\Actions\Widgets;

use App\Enums\DonationContentType;
use App\Enums\DonationCurrency;
use App\Events\Widgets\DonationAlert;
use App\Models\Donation;
use App\Models\Widget;

class SendTestDonationAlert
{
    public function handle(Widget $widget): void
    {
        $donation = new Donation([
            'streamer_id' => $widget->user_id,
            'donor_name' => 'Cristiano Ronaldo',
            'amount' => 7,
            'currency' => DonationCurrency::Brl,
            'content_text' => 'Eu sou o melhor!',
            'content_type' => DonationContentType::Text,
            'content_path' => null,
        ]);

        $donation->id = 'test';

        broadcast(new DonationAlert($donation));
    }
}
