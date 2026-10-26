<?php

namespace App\Actions\Goals;

use App\Events\Widgets\GoalUpdated;
use App\Models\Goal;
use Illuminate\Support\Facades\DB;

class UpdateGoal
{
    /**
     * @throws \Throwable
     */
    public function handle(
        Goal $goal,
        string $title,
        string $targetAmount,
        ?string $raisedAmount,
        string $closesAt,
        string $backgroundColor,
        string $progressBarColor,
        string $textColor,
        ?bool $showProfileLink,
    ): void {
        DB::transaction(function () use (
            $goal,
            $title,
            $targetAmount,
            $raisedAmount,
            $closesAt,
            $backgroundColor,
            $progressBarColor,
            $textColor,
            $showProfileLink,
        ): void {
            $goal->update([
                'title' => $title,
                'target_amount' => $targetAmount,
                'raised_amount' => $raisedAmount,
                'closes_at' => $closesAt,
                'background_color' => $backgroundColor,
                'progress_bar_color' => $progressBarColor,
                'text_color' => $textColor,
                'show_profile_link' => $showProfileLink,
            ]);

            broadcast(new GoalUpdated($goal));
        });
    }
}
