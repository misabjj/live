<?php

namespace App\Actions\Goals;

use App\Events\Widgets\GoalUpdated;
use App\Models\Goal;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateGoal
{
    /**
     * @throws \Throwable
     */
    public function handle(
        User $user,
        string $title,
        string $targetAmount,
        string $closesAt,
        string $backgroundColor,
        string $progressBarColor,
        string $textColor,
        bool $showProfileLink,
        ?string $initialAmount = null,
    ): Goal {
        return DB::transaction(function () use (
            $user,
            $title,
            $targetAmount,
            $closesAt,
            $backgroundColor,
            $progressBarColor,
            $textColor,
            $showProfileLink,
            $initialAmount,
        ): Goal {
            $user->goals()->active()->update(['is_active' => false]);

            $goal = $user->goals()->create([
                'title' => $title,
                'target_amount' => $targetAmount,
                'closes_at' => $closesAt,
                'background_color' => $backgroundColor,
                'progress_bar_color' => $progressBarColor,
                'text_color' => $textColor,
                'show_profile_link' => $showProfileLink,
                'raised_amount' => $initialAmount ?? 0,
                'is_active' => true,
            ]);

            broadcast(new GoalUpdated($goal));

            return $goal;
        });
    }
}
