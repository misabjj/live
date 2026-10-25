<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UpdateDonationRulesRequest;
use App\Support\Toast;

class DonationRulesController extends Controller
{
    public function show()
    {
        return inertia('settings/donation-rules', [
            'rules' => auth()->user()->donationRules->only([
                'accept_ai_audio',
                'accept_donor_audio',
                'min_amount_text',
                'min_amount_text_to_speech',
                'min_amount_audio',
                'max_characters_text',
                'max_characters_text_to_speech',
                'max_audio_duration',
            ]),
        ]);
    }

    public function update(UpdateDonationRulesRequest $request)
    {
        auth()->user()->donationRules()->updateOrCreate(
            ['user_id' => auth()->id()],
            $request->validated()
        );

        Toast::success('Regras atualizadas com sucesso!');

        return back();
    }
}
