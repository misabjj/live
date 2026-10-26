<?php

namespace App\Actions\Goals;

use App\Models\Goal;

class DeleteGoal
{
    public function handle(Goal $goal): void
    {
        $goal->delete();
    }
}
