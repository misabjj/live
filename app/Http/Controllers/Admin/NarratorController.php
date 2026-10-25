<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Narrator;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class NarratorController extends Controller
{
    public function index(Request $request)
    {
        $narrators = QueryBuilder::for(Narrator::query())
            ->allowedFilters(AllowedFilter::partial('name'))
            ->defaultSort('-created_at')
            ->paginate()
            ->withQueryString()
            ->through(fn (Narrator $narrator) => [
                'id' => $narrator->id,
                'name' => $narrator->name,
                'image_path' => $narrator->image_path,
                'voice_id' => $narrator->voice_id,
                'voice_preview_path' => $narrator->voice_preview_path,
                'is_active' => $narrator->is_active,
                'created_at' => $narrator->created_at->format('d/m/Y H:i'),
            ]);

        return inertia('admin/narrators/index', [
            'narrators' => $narrators,
            'filter' => [
                'name' => $request->query('filter.name', ''),
            ],
        ]);
    }
}
