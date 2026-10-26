<?php

namespace App\Events\Widgets;

use App\Enums\WidgetType;
use App\Models\Goal;
use App\Models\Widget;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GoalUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Goal $goal
    ) {}

    public function broadcastOn(): array
    {
        $widget = Widget::where('user_id', $this->goal->user_id)
            ->where('type', WidgetType::Goal)
            ->firstOrFail();

        return [
            new Channel('widgets.'.$widget->token),
        ];
    }

    public function broadcastAs(): string
    {
        return 'goal.updated';
    }

    /** @return array<string, mixed> */
    public function broadcastWith(): array
    {
        if (! $this->goal->is_active) {
            return [];
        }

        return [
            'id' => $this->goal->id,
            'title' => $this->goal->title,
            'raised_amount' => $this->goal->raised_amount,
            'target_amount' => $this->goal->target_amount,
            'closes_at' => $this->goal->closes_at,
            'background_color' => $this->goal->background_color,
            'progress_bar_color' => $this->goal->progress_bar_color,
            'text_color' => $this->goal->text_color,
            'show_profile_link' => $this->goal->show_profile_link,
            'user_handle' => $this->goal->user->handle,
            'percentage' => $this->goal->getProgressPercentage(),
        ];
    }
}
