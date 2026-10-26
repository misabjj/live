<?php

namespace App\Actions\Controls;

use App\Events\Widgets\QueuePaused;
use App\Events\Widgets\QueueResumed;
use App\Models\User;

class ToggleAutoplay
{
    public function handle(User $user): bool
    {
        $isPaused = ! $user->queue_paused;
        $user->update(['queue_paused' => $isPaused]);

        broadcast($isPaused ? new QueuePaused($user) : new QueueResumed($user));

        return $isPaused;
    }
}
