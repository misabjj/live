<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Donations\PlayAlert;
use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Support\Toast;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class DonationController extends Controller
{
    public function index(Request $request): Response
    {
        $donations = QueryBuilder::for(Donation::query()->with('streamer'))
            ->allowedFilters(AllowedFilter::partial('donor_name'), AllowedFilter::exact('streamer_id'))
            ->defaultSort('-created_at')
            ->paginate()
            ->withQueryString()
            ->through(fn (Donation $donation): array => [
                'id' => $donation->id,
                'donor_name' => $donation->donor_name,
                'amount' => $donation->amount,
                'currency' => $donation->currency->value,
                'status' => $donation->status->value,
                'created_at' => $donation->created_at,
                'streamer' => [
                    'id' => $donation->streamer->id,
                    'display_name' => $donation->streamer->display_name,
                    'handle' => $donation->streamer->handle,
                ],
            ]);

        return Inertia::render('admin/donations/index', [
            'donations' => $donations,
            'filter' => [
                'donor_name' => $request->query('filter.donor_name', ''),
                'streamer_id' => $request->query('filter.streamer_id', ''),
            ],
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function playDonationAlert(Donation $donation, PlayAlert $playAlert): RedirectResponse
    {
        $wasBroadcast = $playAlert->handle($donation);

        Toast::success($wasBroadcast ? __('toasts.donation_alert_queued') : __('toasts.donation_alert_added_to_queue'));

        return back();
    }
}
