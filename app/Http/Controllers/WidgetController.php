<?php

namespace App\Http\Controllers;

use App\Actions\Widgets\MarkDonationAlertPlayed as MarkWidgetDonationAlertPlayed;
use App\Actions\Widgets\RegenerateWidget;
use App\Actions\Widgets\SendTestDonationAlert;
use App\Enums\WidgetType;
use App\Models\Donation;
use App\Models\Goal;
use App\Models\Widget;
use App\Support\AuthenticatedUser;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WidgetController extends Controller
{
    public function index(): Response
    {
        $widgets = app(AuthenticatedUser::class)->get()->widgets()->get()->map(fn (Widget $widget): array => [
            'id' => $widget->id,
            'type' => $widget->type->value,
            'token' => $widget->token,
            'url' => $widget->getUrl(),
        ]);

        return Inertia::render('settings/widgets', [
            'widgets' => $widgets,
        ]);
    }

    public function show(Widget $widget): Response
    {
        Inertia::setRootView('widget');

        if ($widget->type === WidgetType::Goal) {
            $goal = Goal::active()->where('user_id', $widget->user->id)->first();

            return Inertia::render('widgets/goal', [
                'goal' => $goal ? [
                    'id' => $goal->id,
                    'title' => $goal->title,
                    'target_amount' => $goal->target_amount,
                    'raised_amount' => $goal->raised_amount,
                    'background_color' => $goal->background_color,
                    'progress_bar_color' => $goal->progress_bar_color,
                    'text_color' => $goal->text_color,
                    'show_profile_link' => $goal->show_profile_link,
                    'user_handle' => $goal->user->handle,
                    'closes_at' => $goal->closes_at,
                ] : null,
                'widget' => ['token' => $widget->token],
            ]);
        }

        if ($widget->type === WidgetType::DonationAlert) {
            $configuration = $widget->user->donationAlertConfiguration ?? abort(404);

            return Inertia::render('widgets/donation-alert', [
                'token' => $widget->token,
                'configuration' => [
                    'primary_color' => $configuration->primary_color,
                    'secondary_color' => $configuration->secondary_color,
                    'message_color' => $configuration->message_color,
                ],
            ]);
        }

        $profileQrCode = $widget->user->profileQrCode ?? abort(404);

        return Inertia::render('widgets/profile-qr-code', [
            'user' => [
                'handle' => $widget->user->handle,
                'profile_url' => $widget->user->getProfileUrl(),
            ],
            'widget' => ['token' => $widget->token],
            'profile_qr_code' => [
                'gradient_color_1' => $profileQrCode->gradient_color_1,
                'gradient_color_2' => $profileQrCode->gradient_color_2,
                'gradient_type' => $profileQrCode->gradient_type,
                'gradient_rotation' => $profileQrCode->gradient_rotation,
                'dots_type' => $profileQrCode->dots_type,
                'message' => $profileQrCode->message,
                'text_color' => $profileQrCode->text_color,
                'background_color' => $profileQrCode->background_color,
            ],
        ]);
    }

    public function regenerate(Widget $widget, RegenerateWidget $regenerateWidget): RedirectResponse
    {
        $this->authorize('update', $widget);

        $regenerateWidget->handle($widget);

        Toast::success(__('toasts.widget_regenerated'));

        return back();
    }

    public function test(Widget $widget, SendTestDonationAlert $sendTestDonationAlert): RedirectResponse
    {
        $this->authorize('update', $widget);

        if ($widget->type !== WidgetType::DonationAlert) {
            abort(400, 'Only alert widgets can be tested.');
        }

        $sendTestDonationAlert->handle($widget);

        Toast::success(__('toasts.test_alert_sent'));

        return back();
    }

    public function alertPlayed(Widget $widget, Donation $donation, MarkWidgetDonationAlertPlayed $markDonationAlertPlayed): RedirectResponse
    {
        $markDonationAlertPlayed->handle($widget, $donation);

        return back();
    }
}
