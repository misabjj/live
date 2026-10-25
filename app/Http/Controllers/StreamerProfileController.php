<?php

namespace App\Http\Controllers;

use App\Models\Narrator;
use App\Models\PaymentProcessor;
use App\Models\User;

class StreamerProfileController extends Controller
{
    public function show(User $streamer)
    {
        $paymentProcessors = $streamer->paymentProcessors()->active()->get()
            ->map(fn (PaymentProcessor $processor) => [
                'processor' => $processor->processor,
                'display_name' => $processor->getTypeDisplayName(),
                'supports_pix' => $processor->supportsPix(),
                'supports_credit_card' => $processor->supportsCreditCard(),
            ])
            ->values()
            ->all();

        if (empty($paymentProcessors) || ! $streamer->accepting_donations) {
            return inertia('streamers/donations-unavailable', [
                'streamer' => [
                    'handle' => $streamer->handle,
                    'accepting_donations' => $streamer->accepting_donations,
                ],
                'reason' => empty($paymentProcessors) ? 'no_payment_processors' : 'not_accepting_donations',
            ]);
        }

        $narrators = Narrator::active()->get()->map(fn (Narrator $narrator) => [
            'id' => $narrator->id,
            'name' => $narrator->name,
            'image_path' => $narrator->image_path,
            'voice_id' => $narrator->voice_id,
            'voice_preview_path' => $narrator->voice_preview_path,
        ]);

        $donationRules = $streamer->donationRules;

        return inertia('streamers/profile', [
            'streamer' => [
                'id' => $streamer->id,
                'profile_photo' => $streamer->getProfilePhotoUrl(),
                'background_image' => $streamer->getBackgroundImageUrl(),
                'display_name' => $streamer->display_name,
                'handle' => $streamer->handle,
                'background_color' => $streamer->background_color,
            ],
            'narrators' => $narrators,
            'payment_processors' => $paymentProcessors,
            'donation_rules' => [
                'min_amount_audio' => $donationRules->min_amount_audio,
                'min_amount_text' => $donationRules->min_amount_text,
                'min_amount_text_to_speech' => $donationRules->min_amount_text_to_speech,
                'max_characters_text' => $donationRules->max_characters_text,
                'max_characters_text_to_speech' => $donationRules->max_characters_text_to_speech,
                'max_audio_duration' => $donationRules->max_audio_duration,
                'accept_ai_audio' => $donationRules->accept_ai_audio,
                'accept_donor_audio' => $donationRules->accept_donor_audio,
            ],
        ]);
    }
}
