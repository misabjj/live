<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Widget;

class WidgetPolicy
{
    public function update(User $user, Widget $widget): bool
    {
        return $user->id === $widget->user_id;
    }
}
