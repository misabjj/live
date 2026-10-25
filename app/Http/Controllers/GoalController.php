<?php

namespace App\Http\Controllers;

use App\Actions\Goals\CreateGoal;
use App\Actions\Goals\ToggleGoalStatus;
use App\Events\Widgets\GoalUpdated;
use App\Http\Requests\GoalRequest;
use App\Models\Goal;
use App\Models\Widget;
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
        $goals = QueryBuilder::for(
            auth()->user()->goals()
        )
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

        $goalWidget = Widget::goal()->where('user_id', auth()->id())->first();

        return Inertia::render('goals/index', [
            'goals' => $goals,
            'filter' => [
                'title' => $request->query('filter.title', ''),
            ],
            'widget' => $goalWidget ? [
                'id' => $goalWidget->id,
                'url' => $goalWidget->getUrl(),
            ] : null,
        ]);
    }

    public function create(): Response
    {
        return inertia('goals/create', [
            'defaults' => Goal::getDefaults(),
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function store(GoalRequest $request, CreateGoal $createGoal): RedirectResponse
    {
        $createGoal->handle(
            user: auth()->user(),
            title: $request->title,
            targetAmount: $request->target_amount,
            closesAt: $request->closes_at,
            backgroundColor: $request->background_color,
            progressBarColor: $request->progress_bar_color,
            textColor: $request->text_color,
            showProfileLink: $request->show_profile_link,
            initialAmount: $request->raised_amount,
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
                'closes_at' => $goal->serializeDate($goal->closes_at),
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
    public function update(GoalRequest $request, Goal $goal): RedirectResponse
    {
        $this->authorize('update', $goal);

        \DB::transaction(function () use ($request, $goal) {
            $goal->update([
                'title' => $request->title,
                'target_amount' => $request->target_amount,
                'raised_amount' => $request->raised_amount ?? 0,
                'closes_at' => $request->closes_at,
                'background_color' => $request->background_color,
                'progress_bar_color' => $request->progress_bar_color,
                'text_color' => $request->text_color,
                'show_profile_link' => $request->show_profile_link,
            ]);

            broadcast(new GoalUpdated($goal));
        });

        Toast::success('Meta atualizada com sucesso!');

        return back();
    }

    public function destroy(Goal $goal): RedirectResponse
    {
        $this->authorize('delete', $goal);

        $goal->delete();

        Toast::success('Meta deletada com sucesso!');

        return back();
    }

    /**
     * @throws \Throwable
     */
    public function toggleStatus(Goal $goal, ToggleGoalStatus $toggleGoalStatus): RedirectResponse
    {
        $this->authorize('update', $goal);

        $toggleGoalStatus->handle($goal);

        Toast::success($goal->is_active ? 'Meta ativada com sucesso!' : 'Meta desativada com sucesso!');

        return back();
    }
}
