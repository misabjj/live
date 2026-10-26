<?php

namespace App\Actions\Widgets;

use App\Models\Widget;

class RegenerateWidget
{
    public function handle(Widget $widget): void
    {
        $widget->regenerateToken();
    }
}
