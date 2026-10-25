<?php

namespace App\Actions\Goals;

use App\Events\Widgets\GoalUpdated;
use App\Models\Goal;
use Illuminate\Support\Facades\DB;

class ToggleGoalStatus
{
    /**
     * @throws \Throwable
     */
    public function handle(Goal $goal): void
    {
        DB::transaction(function () use ($goal): void {
            if ($goal->is_active) {
                $goal->update(['is_active' => false]);
            } else {
                Goal::where('user_id', $goal->user_id)
                    ->active()
                    ->update(['is_active' => false]);

                $goal->update(['is_active' => true]);
            }

            broadcast(new GoalUpdated($goal));
        });
    }
}
