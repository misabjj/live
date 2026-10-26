<?php

namespace App\Http\Controllers\Settings;

use App\Actions\Settings\UpdateDonationRules;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateDonationRulesRequest;
use App\Support\AuthenticatedUser;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DonationRulesController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('settings/donation-rules', [
            'rules' => app(AuthenticatedUser::class)->get()->donationRules->only([
                'accept_donor_audio',
                'min_amount_text',
                'min_amount_audio',
                'max_characters_text',
                'max_audio_duration',
            ]),
        ]);
    }

    public function update(UpdateDonationRulesRequest $request, UpdateDonationRules $updateDonationRules): RedirectResponse
    {
        $updateDonationRules->handle(app(AuthenticatedUser::class)->get(), $request->validated());

        Toast::success(__('toasts.donation_rules_updated'));

        return back();
    }
}
