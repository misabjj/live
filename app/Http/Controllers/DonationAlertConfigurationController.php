<?php

namespace App\Http\Controllers;

use App\Actions\Settings\UpdateDonationAlertConfiguration as UpdateConfiguration;
use App\Http\Requests\Settings\UpdateDonationAlertConfigurationRequest;
use App\Models\Widget;
use App\Support\AuthenticatedUser;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DonationAlertConfigurationController extends Controller
{
    public function show(): Response
    {
        $user = app(AuthenticatedUser::class)->get();
        $widget = Widget::donationAlert()->where('user_id', $user->id)->first();

        return Inertia::render('settings/donation-alert', [
            'configuration' => $user->donationAlertConfiguration,
            'widget' => $widget ? ['id' => $widget->id, 'url' => $widget->getUrl()] : null,
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function update(UpdateDonationAlertConfigurationRequest $request, UpdateConfiguration $updateConfiguration): RedirectResponse
    {
        $updateConfiguration->handle(app(AuthenticatedUser::class)->get(), $request->validated());

        Toast::success(__('toasts.donation_alert_configuration_updated'));

        return back();
    }
}
