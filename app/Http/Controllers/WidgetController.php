<?php

namespace App\Http\Controllers;

use App\Data\Widgets\DonationAlertWidgetData;
use App\Enums\DonationContentType;
use App\Enums\DonationCurrency;
use App\Enums\WidgetType;
use App\Events\Widgets\DonationAlert;
use App\Events\Widgets\DonationAlertPlayed;
use App\Models\Donation;
use App\Models\Goal;
use App\Models\Narrator;
use App\Models\Widget;
use App\Support\Toast;

class WidgetController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $widgets = $user->widgets()->get()->map(function (Widget $widget) {
            return [
                'id' => $widget->id,
                'type' => $widget->type->value,
                'token' => $widget->token,
                'url' => $widget->getUrl(),
            ];
        });

        return inertia('settings/widgets', [
            'widgets' => $widgets,
        ]);
    }

    public function show(Widget $widget)
    {
        inertia()->setRootView('widget');

        if ($widget->type === WidgetType::Goal) {
            $goal = Goal::active()->where('user_id', $widget->user->id)->first();

            return inertia('widgets/goal', [
                'goal' => $goal ? [
                    'id' => $goal->id,
                    'title' => $goal->title,
                    'target_amount' => $goal->target_amount,
                    'raised_amount' => $goal->raised_amount,
                    'background_color' => $goal->background_color,
                    'progress_bar_color' => $goal->progress_bar_color,
                    'text_color' => $goal->text_color,
                    'show_profile_link' => $goal->show_profile_link,
                    'user_handle' => $goal->user?->handle,
                    'closes_at' => $goal->closes_at,
                ] : null,
                'widget' => [
                    'token' => $widget->token,
                ],
            ]);
        }

        if ($widget->type === WidgetType::DonationAlert) {
            $configuration = $widget->user->donationAlertConfiguration;

            return inertia('widgets/donation-alert',
                DonationAlertWidgetData::from([
                    'token' => $widget->token,
                    'configuration' => [
                        'primary_color' => $configuration->primary_color,
                        'secondary_color' => $configuration->secondary_color,
                        'message_color' => $configuration->message_color,
                    ],
                ])
            );
        }

        if ($widget->type === WidgetType::ProfileQrCode) {
            $profileQrCode = $widget->user->profileQrCode;

            return inertia('widgets/profile-qr-code', [
                'user' => [
                    'handle' => $widget->user->handle,
                    'profile_url' => $widget->user->getProfileUrl(),
                ],
                'widget' => [
                    'token' => $widget->token,
                ],
                'profile_qr_code' => [
                    'gradient_color_1' => $profileQrCode->gradient_color_1,
                    'gradient_color_2' => $profileQrCode->gradient_color_2,
                    'gradient_type' => $profileQrCode->gradient_type,
                    'gradient_rotation' => $profileQrCode->gradient_rotation,
                    'dots_type' => $profileQrCode->dots_type,
                    'message' => $profileQrCode->message,
                    'text_color' => $profileQrCode->text_color,
                    'background_color' => $profileQrCode->background_color,
                    'card_border_color' => $profileQrCode->card_border_color,
                ],
            ]);
        }

        abort(500, 'Widget not found.');
    }

    public function regenerate(Widget $widget)
    {
        $this->authorize('update', $widget);

        $widget->regenerateToken();

        Toast::success('Regenerado com sucesso!');

        return back();
    }

    public function test(Widget $widget)
    {
        $this->authorize('update', $widget);

        if ($widget->type !== WidgetType::DonationAlert) {
            abort(400, 'Only alert widgets can be tested.');
        }

        $narrator = Narrator::active()
            ->where('voice_id', config('services.supertonic.test_voice'))
            ->firstOrFail();

        $donation = new Donation([
            'streamer_id' => $widget->user_id,
            'donor_name' => 'Cristiano Ronaldo',
            'amount' => 7,
            'currency' => DonationCurrency::Brl,
            'content_text' => 'Eu sou o melhor!',
            'content_type' => DonationContentType::TextToSpeech,
            'content_path' => null,
            'narrator_id' => $narrator->id,
        ]);

        $donation->id = 'test';
        $donation->setRelation('narrator', $narrator);

        broadcast(new DonationAlert($donation));

        Toast::success('Alerta de teste enviado!');

        return back();
    }

    public function alertPlayed(Widget $widget, Donation $donation)
    {
        if ($donation->streamer_id !== $widget->user_id) {
            abort(403);
        }

        $donation->update(['in_queue' => false]);

        broadcast(new DonationAlertPlayed($widget->token, $donation->id));
    }
}
