<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

abstract class BaseModel extends Model
{
    /**
     * Prepare a date for array / JSON serialization.
     */
    public function serializeDate(\DateTimeInterface $date): string
    {
        return Carbon::instance($date)->toIso8601String();
    }
}
