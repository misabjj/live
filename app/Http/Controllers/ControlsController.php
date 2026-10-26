<?php

namespace App\Http\Controllers;

use App\Actions\Controls\MarkDonationAlertPlayed;
use App\Actions\Controls\PlaySpecificDonation;
use App\Actions\Controls\SkipDonationAlert;
use App\Actions\Controls\ToggleAcceptingDonations;
use App\Actions\Controls\ToggleAutoplay;
use App\Enums\WidgetType;
use App\Models\Donation;
use App\Support\AuthenticatedUser;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ControlsController extends Controller
{
    public function index(): Response
    {
        $user = app(AuthenticatedUser::class)->get();

        $unplayedDonations = $user->donations()
            ->approved()
            ->unplayed()
            ->latest('approved_at')
            ->get()
            ->map(fn (Donation $donation): array => [
                'id' => $donation->id,
                'donor_name' => $donation->donor_name,
                'amount' => $donation->amount,
                'currency' => $donation->currency->value,
                'content_text' => $donation->content_text,
                'content_path' => $donation->getContentUrl(),
                'content_type' => $donation->content_type->value,
                'approved_at' => $donation->approved_at,
            ]);
        $widget = $user->widgets()->where('type', WidgetType::DonationAlert)->first();

        return Inertia::render('streamers/controls', [
            'queue_paused' => $user->queue_paused,
            'accepting_donations' => $user->accepting_donations,
            'profile_url' => route('donate.show', $user->handle),
            'unplayed_donations' => $unplayedDonations,
            'donation_alert_widget_token' => $widget?->token,
        ]);
    }

    public function toggleAutoplay(ToggleAutoplay $toggleAutoplay): RedirectResponse
    {
        $isPaused = $toggleAutoplay->handle(app(AuthenticatedUser::class)->get());

        if ($isPaused) {
            Toast::success(__('toasts.queue_paused'));
        } else {
            Toast::success(__('toasts.queue_resumed'));
        }

        return back();
    }

    public function toggleAcceptingDonations(ToggleAcceptingDonations $toggleAcceptingDonations): RedirectResponse
    {
        $user = app(AuthenticatedUser::class)->get();

        if (! $toggleAcceptingDonations->handle($user)) {
            Toast::warning(__('toasts.payment_processor_required'));

            return to_route('settings.payment-processors.index');
        }

        Toast::success(__('toasts.settings_updated'));

        return back();
    }

    public function skipDonationAlert(SkipDonationAlert $skipDonationAlert): RedirectResponse
    {
        $skipDonationAlert->handle(app(AuthenticatedUser::class)->get());

        Toast::success(__('toasts.donation_alert_skipped'));

        return back();
    }

    public function playSpecificDonation(Donation $donation, PlaySpecificDonation $playSpecificDonation): RedirectResponse
    {
        $user = app(AuthenticatedUser::class)->get();
        $playSpecificDonation->handle($user, $donation);

        Toast::success(__('toasts.donation_alert_replayed'));

        return back();
    }

    public function markAsPlayed(Donation $donation, MarkDonationAlertPlayed $markDonationAlertPlayed): RedirectResponse
    {
        $user = app(AuthenticatedUser::class)->get();
        $markDonationAlertPlayed->handle($user, $donation);

        Toast::success(__('toasts.donation_alert_removed_from_queue'));

        return back();
    }
}
