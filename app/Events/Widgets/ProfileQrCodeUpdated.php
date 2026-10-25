<?php

namespace App\Events\Widgets;

use App\Enums\WidgetType;
use App\Models\ProfileQrCode;
use App\Models\Widget;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ProfileQrCodeUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public ProfileQrCode $profileQrCode
    ) {}

    public function broadcastOn(): array
    {
        $widget = Widget::where('user_id', $this->profileQrCode->user_id)
            ->where('type', WidgetType::ProfileQrCode)
            ->firstOrFail();

        return [
            new Channel('widgets.'.$widget->token),
        ];
    }

    public function broadcastAs(): string
    {
        return 'profile-qr-code.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'gradient_color_1' => $this->profileQrCode->gradient_color_1,
            'gradient_color_2' => $this->profileQrCode->gradient_color_2,
            'gradient_type' => $this->profileQrCode->gradient_type,
            'gradient_rotation' => $this->profileQrCode->gradient_rotation,
            'dots_type' => $this->profileQrCode->dots_type,
            'message' => $this->profileQrCode->message,
            'text_color' => $this->profileQrCode->text_color,
            'background_color' => $this->profileQrCode->background_color,
            'card_border_color' => $this->profileQrCode->card_border_color,
        ];
    }
}
