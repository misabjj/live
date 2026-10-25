<?php

namespace App\Events\Widgets;

use App\Data\Events\DonationAlertEventData;
use App\Enums\DonationContentType;
use App\Enums\WidgetType;
use App\Models\Donation;
use App\Models\Widget;
use App\Support\MoneyToWords;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class DonationAlert implements ShouldBroadcast
{
    use Dispatchable;

    public function __construct(
        public Donation $donation,
        public bool $forcePlay = false,
    ) {}

    public function broadcastOn(): array
    {
        $widget = Widget::where('user_id', $this->donation->streamer_id)
            ->where('type', WidgetType::DonationAlert)
            ->firstOrFail();

        return [
            new Channel('widgets.'.$widget->token),
        ];
    }

    public function broadcastAs(): string
    {
        return 'DonationAlertCreated';
    }

    public function broadcastWith(): array
    {
        return DonationAlertEventData::from([
            'donation' => [
                'id' => $this->donation->id,
                'donor_name' => $this->donation->donor_name,
                'amount' => $this->donation->amount,
                'currency' => $this->donation->currency->value,
                'content_text' => $this->donation->content_text,
                'content_type' => $this->donation->content_type,
                'content_url' => $this->donation->getContentUrl(),
                'speech_text' => $this->donation->content_type === DonationContentType::TextToSpeech
                    ? $this->donation->donor_name.' mandou '.MoneyToWords::toWords($this->donation->amount).'... '.$this->donation->content_text
                    : null,
                'voice_id' => $this->donation->narrator?->voice_id,
            ],
            'force_play' => $this->forcePlay,
        ])->toArray();
    }
}
