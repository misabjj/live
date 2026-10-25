<?php

namespace App\Events\Widgets;

use App\Data\Events\DonationAlertConfigurationUpdatedEventData;
use App\Enums\WidgetType;
use App\Models\DonationAlertConfiguration;
use App\Models\Widget;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DonationAlertConfigurationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public DonationAlertConfiguration $configuration
    ) {}

    public function broadcastOn(): array
    {
        $widget = Widget::where('user_id', $this->configuration->user_id)
            ->where('type', WidgetType::DonationAlert)
            ->firstOrFail();

        return [
            new Channel('widgets.'.$widget->token),
        ];
    }

    public function broadcastAs(): string
    {
        return 'DonationAlertConfigurationUpdated';
    }

    public function broadcastWith(): array
    {
        return DonationAlertConfigurationUpdatedEventData::from([
            'primary_color' => $this->configuration->primary_color,
            'secondary_color' => $this->configuration->secondary_color,
            'message_color' => $this->configuration->message_color,
        ])->toArray();
    }
}
