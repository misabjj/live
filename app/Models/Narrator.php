<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class Narrator extends BaseModel
{
    use HasUlids;

    protected $fillable = [
        'id',
        'name',
        'image_path',
        'voice_id',
        'voice_preview_path',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
