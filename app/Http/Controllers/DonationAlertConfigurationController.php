<?php

namespace App\Http\Controllers;

use App\Events\Widgets\DonationAlertConfigurationUpdated;
use App\Http\Requests\Settings\UpdateDonationAlertConfigurationRequest;
use App\Models\DonationAlertConfiguration;
use App\Models\Widget;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DonationAlertConfigurationController extends Controller
{
    public function show(): Response
    {
        $widget = Widget::donationAlert()->where('user_id', auth()->id())->first();

        return Inertia::render('settings/donation-alert', [
            'configuration' => auth()->user()->donationAlertConfiguration,
            'widget' => $widget ? [
                'id' => $widget->id,
                'url' => $widget->getUrl(),
            ] : null,
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function update(UpdateDonationAlertConfigurationRequest $request): RedirectResponse
    {
        \DB::transaction(function () use ($request) {
            $configuration = DonationAlertConfiguration::updateOrCreate(
                ['user_id' => auth()->id()],
                $request->validated()
            );

            broadcast(new DonationAlertConfigurationUpdated($configuration));
        });

        Toast::success('Configurações de alerta de doação atualizadas com sucesso!');

        return back();
    }
}
