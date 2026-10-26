<?php

namespace App\Http\Controllers;

use App\Actions\Goals\CreateGoal;
use App\Actions\Goals\DeleteGoal;
use App\Actions\Goals\ToggleGoalStatus;
use App\Actions\Goals\UpdateGoal;
use App\Http\Requests\GoalRequest;
use App\Models\Goal;
use App\Models\Widget;
use App\Support\AuthenticatedUser;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class GoalController extends Controller
{
    public function index(Request $request): Response
    {
        $goals = QueryBuilder::for(app(AuthenticatedUser::class)->get()->goals())
            ->allowedFilters(AllowedFilter::partial('title'))
            ->orderByDesc('is_active')
            ->paginate()
            ->withQueryString()
            ->through(fn (Goal $goal): array => [
                'id' => $goal->id,
                'title' => $goal->title,
                'target_amount' => $goal->target_amount,
                'raised_amount' => $goal->raised_amount,
                'is_active' => $goal->is_active,
                'closes_at' => $goal->closes_at,
                'created_at' => $goal->created_at,
            ]);
        $goalWidget = Widget::goal()->where('user_id', app(AuthenticatedUser::class)->get()->id)->first();

        return Inertia::render('goals/index', [
            'goals' => $goals,
            'filter' => [
                'title' => $request->query('filter.title', ''),
            ],
            'widget' => $goalWidget ? ['id' => $goalWidget->id, 'url' => $goalWidget->getUrl()] : null,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('goals/create', [
            'defaults' => Goal::getDefaults(),
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function store(GoalRequest $request, CreateGoal $createGoal): RedirectResponse
    {
        $createGoal->handle(
            user: app(AuthenticatedUser::class)->get(),
            title: $request->title,
            targetAmount: (string) $request->target_amount,
            closesAt: $request->closes_at,
            backgroundColor: $request->background_color,
            progressBarColor: $request->progress_bar_color,
            textColor: $request->text_color,
            showProfileLink: filter_var($request->show_profile_link, FILTER_VALIDATE_BOOLEAN),
            initialAmount: $request->raised_amount !== null ? (string) $request->raised_amount : null,
        );

        return redirect()->route('goals.index');
    }

    public function edit(Goal $goal): Response
    {
        $this->authorize('update', $goal);

        return Inertia::render('goals/edit', [
            'goal' => [
                'id' => $goal->id,
                'title' => $goal->title,
                'target_amount' => $goal->target_amount,
                'raised_amount' => $goal->raised_amount,
                'closes_at' => $goal->closes_at,
                'background_color' => $goal->background_color,
                'progress_bar_color' => $goal->progress_bar_color,
                'text_color' => $goal->text_color,
                'show_profile_link' => $goal->show_profile_link,
            ],
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function update(GoalRequest $request, Goal $goal, UpdateGoal $updateGoal): RedirectResponse
    {
        $this->authorize('update', $goal);

        $validated = $request->validated();

        $updateGoal->handle(
            goal: $goal,
            title: (string) $validated['title'],
            targetAmount: (string) $validated['target_amount'],
            raisedAmount: array_key_exists('raised_amount', $validated)
                ? ($validated['raised_amount'] === null ? null : (string) $validated['raised_amount'])
                : (string) $goal->raised_amount,
            closesAt: (string) $validated['closes_at'],
            backgroundColor: (string) $validated['background_color'],
            progressBarColor: (string) $validated['progress_bar_color'],
            textColor: (string) $validated['text_color'],
            showProfileLink: array_key_exists('show_profile_link', $validated)
                ? ($validated['show_profile_link'] === null
                    ? null
                    : filter_var($validated['show_profile_link'], FILTER_VALIDATE_BOOLEAN))
                : $goal->show_profile_link,
        );

        Toast::success(__('toasts.goal_updated'));

        return back();
    }

    public function destroy(Goal $goal, DeleteGoal $deleteGoal): RedirectResponse
    {
        $this->authorize('delete', $goal);

        $deleteGoal->handle($goal);

        Toast::success(__('toasts.goal_deleted'));

        return back();
    }

    /**
     * @throws \Throwable
     */
    public function toggleStatus(Goal $goal, ToggleGoalStatus $toggleGoalStatus): RedirectResponse
    {
        $this->authorize('update', $goal);

        $toggleGoalStatus->handle($goal);

        Toast::success($goal->is_active ? __('toasts.goal_activated') : __('toasts.goal_deactivated'));

        return back();
    }
}
