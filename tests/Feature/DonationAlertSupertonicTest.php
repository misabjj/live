<?php

use App\Enums\DonationContentType;
use App\Enums\WidgetType;
use App\Events\Widgets\DonationAlert;
use App\Models\Donation;
use App\Models\Narrator;
use App\Models\User;
use App\Models\Widget;
use Illuminate\Support\Facades\Event;

it('broadcasts the normalized transcript and Supertonic voice code', function () {
    $narrator = Narrator::active()->where('voice_id', 'M1')->firstOrFail();
    $donation = new Donation([
        'donor_name' => 'Maria',
        'amount' => 5,
        'content_type' => DonationContentType::TextToSpeech,
        'content_text' => 'Olá, transmissão!',
    ]);
    $donation->id = 'test-donation';
    $donation->currency = 'BRL';
    $donation->setRelation('narrator', $narrator);

    $payload = (new DonationAlert($donation))->broadcastWith();

    expect($payload['donation']['voice_id'])->toBe('M1')
        ->and($payload['donation']['speech_text'])->toContain('Maria mandou')
        ->and($payload['donation']['speech_text'])->toEndWith('Olá, transmissão!');
});

it('sends the built-in widget test as Supertonic speech', function () {
    Event::fake([DonationAlert::class]);
    config()->set('services.supertonic.test_voice', 'M3');

    $user = User::create([
        'display_name' => 'Streamer',
        'email' => 'widget-test@example.com',
        'handle' => 'widget-test',
    ]);
    $widget = Widget::create([
        'user_id' => $user->id,
        'type' => WidgetType::DonationAlert,
    ]);

    $this->actingAs($user)
        ->post(route('settings.widgets.test', $widget))
        ->assertRedirect();

    Event::assertDispatched(DonationAlert::class, function (DonationAlert $event) {
        return $event->donation->content_type === DonationContentType::TextToSpeech
            && $event->donation->narrator?->voice_id === 'M3'
            && $event->donation->donor_name === 'Cristiano Ronaldo'
            && $event->donation->content_text === 'Eu sou o melhor!';
    });
});

it('lets an admin replay another streamer donation', function () {
    Event::fake([DonationAlert::class]);

    $admin = User::create([
        'display_name' => 'Admin',
        'email' => 'admin@example.com',
        'handle' => 'admin',
        'email_verified_at' => now(),
        'is_admin' => true,
    ]);
    $streamer = User::create([
        'display_name' => 'Streamer',
        'email' => 'admin-replay-streamer@example.com',
        'handle' => 'admin-replay-streamer',
        'queue_paused' => false,
    ]);
    Widget::create([
        'user_id' => $streamer->id,
        'type' => WidgetType::DonationAlert,
    ]);
    $donation = Donation::create([
        'streamer_id' => $streamer->id,
        'currency' => 'BRL',
        'amount' => 7,
        'donor_name' => 'Cristiano Ronaldo',
        'donor_browser_fingerprint' => 'admin-replay-test',
        'donor_ip_address' => '127.0.0.1',
        'payment_processor' => 'stripe',
        'payment_method' => 'pix',
        'payment_id' => 'admin-replay-payment',
        'payment_reference' => 'admin-replay-reference',
        'content_type' => DonationContentType::Text,
        'content_text' => 'Eu sou o melhor!',
        'expires_at' => now()->addHour(),
    ]);

    $this->actingAs($admin)
        ->post(route('admin.donations.play-donation-alert', $donation))
        ->assertRedirect();

    Event::assertDispatched(
        DonationAlert::class,
        fn (DonationAlert $event) => $event->donation->is($donation),
    );
});
