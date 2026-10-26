<?php

namespace App\Http\Controllers;

use App\Models\PaymentProcessor;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class StreamerProfileController extends Controller
{
    public function show(User $streamer): Response
    {
        $paymentProcessors = $streamer->paymentProcessors()->active()->get()
            ->map(fn (PaymentProcessor $processor): array => [
                'processor' => $processor->processor,
                'display_name' => $processor->getTypeDisplayName(),
                'supports_pix' => $processor->supportsPix(),
                'supports_credit_card' => $processor->supportsCreditCard(),
            ])
            ->values()
            ->all();

        if (empty($paymentProcessors) || ! $streamer->accepting_donations) {
            return Inertia::render('streamers/donations-unavailable', [
                'streamer' => [
                    'handle' => $streamer->handle,
                    'accepting_donations' => $streamer->accepting_donations,
                ],
                'reason' => empty($paymentProcessors) ? 'no_payment_processors' : 'not_accepting_donations',
            ]);
        }

        $donationRules = $streamer->donationRules;

        return Inertia::render('streamers/profile', [
            'streamer' => [
                'id' => $streamer->id,
                'profile_photo' => $streamer->getProfilePhotoUrl(),
                'background_image' => $streamer->getBackgroundImageUrl(),
                'display_name' => $streamer->display_name,
                'handle' => $streamer->handle,
                'background_color' => $streamer->background_color,
            ],
            'payment_processors' => $paymentProcessors,
            'donation_rules' => $donationRules->only([
                'min_amount_audio',
                'min_amount_text',
                'max_characters_text',
                'max_audio_duration',
                'accept_donor_audio',
            ]),
        ]);
    }
}
