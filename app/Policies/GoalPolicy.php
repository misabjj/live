<?php

namespace App\Policies;

use App\Models\Goal;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Auth\Access\Response;

class GoalPolicy
{
    use HandlesAuthorization;

    public function update(User $user, Goal $goal): Response
    {
        if ($goal->user()->isNot($user)) {
            return $this->denyAsNotFound();
        }

        return $this->allow();
    }

    public function delete(User $user, Goal $goal): Response
    {
        if ($goal->user()->isNot($user)) {
            return $this->denyAsNotFound();
        }

        return $this->allow();
    }
}
