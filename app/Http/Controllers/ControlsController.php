<?php

namespace App\Http\Controllers;

use App\Enums\WidgetType;
use App\Events\Widgets\DonationAlert;
use App\Events\Widgets\DonationAlertControls;
use App\Events\Widgets\DonationAlertPlayed;
use App\Events\Widgets\QueuePaused;
use App\Events\Widgets\QueueResumed;
use App\Models\Donation;
use App\Support\Toast;

class ControlsController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $unplayedDonations = $user->donations()
            ->approved()
            ->unplayed()
            ->latest('approved_at')
            ->get()
            ->map(fn (Donation $donation) => [
                'id' => $donation->id,
                'donor_name' => $donation->donor_name,
                'amount' => $donation->amount,
                'currency' => $donation->currency->value,
                'content_text' => $donation->content_text,
                'content_path' => $donation->getContentUrl(),
                'content_type' => $donation->content_type->value,
                'approved_at' => $donation->approved_at,
            ]);

        $donationAlertWidget = $user->widgets()->where('type', WidgetType::DonationAlert)->first();

        return inertia('streamers/controls', [
            'queue_paused' => $user->queue_paused,
            'accepting_donations' => $user->accepting_donations,
            'profile_url' => route('donate.show', $user->handle),
            'unplayed_donations' => $unplayedDonations,
            'donation_alert_widget_token' => $donationAlertWidget?->token,
        ]);
    }

    public function toggleAutoplay()
    {
        $user = auth()->user();

        $newPausedState = ! $user->queue_paused;
        $user->update(['queue_paused' => $newPausedState]);

        if ($newPausedState) {
            broadcast(new QueuePaused($user));
            Toast::success('Fila pausada!');
        } else {
            broadcast(new QueueResumed($user));
            Toast::success('Fila retomada!');
        }

        return back();
    }

    public function toggleAcceptingDonations()
    {
        $user = auth()->user();

        if ($user->paymentProcessors()->active()->doesntExist()) {
            Toast::warning('Você precisa ter um processador de pagamento ativo!');

            return to_route('settings.payment-processors.index');
        }

        $user->update(['accepting_donations' => ! $user->accepting_donations]);

        Toast::success('Atualizado com sucesso!');

        return back();
    }

    public function skipDonationAlert()
    {
        $user = auth()->user();

        $widget = $user->widgets()->donationAlert()->first();

        DonationAlertControls::dispatch($widget, 'skip');

        Toast::success('Alerta pulado!');

        return back();
    }

    public function playSpecificDonation(Donation $donation)
    {
        $user = auth()->user();

        if ($donation->streamer_id !== $user->id) {
            abort(403);
        }

        broadcast(new DonationAlert($donation, forcePlay: true));

        Toast::success('Alerta reproduzido!');

        return back();
    }

    public function markAsPlayed(Donation $donation)
    {
        $user = auth()->user();

        if ($donation->streamer_id !== $user->id) {
            abort(403);
        }

        $widget = $user->widgets()->donationAlert()->firstOrFail();

        $donation->update(['in_queue' => false]);

        broadcast(new DonationAlertPlayed($widget->token, $donation->id));

        Toast::success('Alerta removido da fila!');

        return back();
    }
}
