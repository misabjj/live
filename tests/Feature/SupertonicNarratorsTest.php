<?php

use App\Enums\DonationContentType;
use App\Http\Requests\StoreDonationRequest;
use App\Models\Narrator;
use App\Models\User;
use Database\Seeders\NarratorSeeder;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

it('installs the ten active Supertonic voices', function () {
    expect(Narrator::active()->orderBy('voice_id')->pluck('voice_id')->all())
        ->toBe(['F1', 'F2', 'F3', 'F4', 'F5', 'M1', 'M2', 'M3', 'M4', 'M5']);
});

it('keeps legacy narrators and their donation references when reseeding the catalog', function () {
    $streamer = User::create([
        'display_name' => 'Streamer',
        'email' => 'streamer@example.com',
        'handle' => 'streamer',
    ]);

    $legacyNarratorId = strtolower((string) Str::ulid());
    DB::table('narrators')->insert([
        'id' => $legacyNarratorId,
        'name' => 'Legacy voice',
        'image_path' => '/images/narrators/legacy.webp',
        'voice_id' => 'legacy-cartesia-id',
        'voice_preview_path' => '/audio/narrators/legacy.mp3',
        'is_active' => true,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $donationId = strtolower((string) Str::ulid());
    DB::table('donations')->insert([
        'id' => $donationId,
        'streamer_id' => $streamer->id,
        'goal_id' => null,
        'currency' => 'BRL',
        'amount' => 5,
        'donor_name' => 'Doador',
        'donor_browser_fingerprint' => 'test-fingerprint',
        'donor_ip_address' => '127.0.0.1',
        'donor_id' => null,
        'status' => 'approved',
        'payment_processor' => 'stripe',
        'payment_method' => 'pix',
        'payment_id' => 'payment-test',
        'payment_reference' => 'reference',
        'payment_split_id' => null,
        'content_type' => 'text_to_speech',
        'content_text' => 'Mensagem antiga',
        'content_path' => 'donations/legacy.wav',
        'narrator_id' => $legacyNarratorId,
        'created_at' => now(),
        'approved_at' => now(),
        'expires_at' => now()->addHour(),
        'expired_at' => null,
        'in_queue' => false,
        'banned_at' => null,
        'deleted_at' => null,
    ]);

    app(NarratorSeeder::class)->run();

    expect(DB::table('narrators')->where('id', $legacyNarratorId)->value('is_active'))->toBe(0)
        ->and(DB::table('donations')->where('id', $donationId)->value('narrator_id'))->toBe($legacyNarratorId)
        ->and(Narrator::active()->count())->toBe(10);
});

it('accepts only active narrators for new text to speech donations', function () {
    $streamer = User::create([
        'display_name' => 'Streamer',
        'email' => 'validation@example.com',
        'handle' => 'validation-streamer',
    ]);
    $activeNarrator = Narrator::active()->firstOrFail();
    $inactiveNarrator = Narrator::create([
        'name' => 'Inactive',
        'image_path' => null,
        'voice_id' => 'inactive-voice',
        'voice_preview_path' => '/audio/inactive.wav',
        'is_active' => false,
    ]);

    $payload = [
        'donor_name' => 'Doador',
        'content_type' => DonationContentType::TextToSpeech->value,
        'payment_processor' => 'stripe',
        'payment_method' => 'pix',
        'content_text' => 'Olá, mundo!',
        'amount' => 5,
        'narrator_id' => $activeNarrator->id,
    ];

    $request = StoreDonationRequest::create('/donations', 'POST', $payload);
    $route = new Route('POST', '/donations', []);
    $route->bind($request);
    $route->setParameter('streamer', $streamer);
    $request->setRouteResolver(fn () => $route);

    expect(Validator::make($payload, $request->rules())->passes())->toBeTrue();

    $payload['narrator_id'] = $inactiveNarrator->id;

    expect(Validator::make($payload, $request->rules())->errors()->has('narrator_id'))->toBeTrue();
});
