<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Goal;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class GoalController extends Controller
{
    public function index(Request $request)
    {
        $goals = QueryBuilder::for(Goal::query()->with('user'))
            ->allowedFilters(
                AllowedFilter::partial('title'),
                AllowedFilter::exact('user_id'),
            )
            ->defaultSort('-created_at')
            ->paginate()
            ->withQueryString()
            ->through(fn (Goal $goal) => [
                'id' => $goal->id,
                'title' => $goal->title,
                'target_amount' => $goal->target_amount,
                'raised_amount' => $goal->raised_amount,
                'progress_percentage' => $goal->getProgressPercentage(),
                'is_active' => $goal->is_active,
                'closes_at' => $goal->closes_at?->format('d/m/Y H:i'),
                'created_at' => $goal->created_at->format('d/m/Y H:i'),
                'user' => [
                    'id' => $goal->user->id,
                    'display_name' => $goal->user->display_name,
                    'handle' => $goal->user->handle,
                ],
            ]);

        return inertia('admin/goals/index', [
            'goals' => $goals,
            'filter' => [
                'title' => $request->query('filter.title', ''),
                'user_id' => $request->query('filter.user_id', ''),
            ],
        ]);
    }
}
