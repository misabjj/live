<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Donations\BroadcastDonationAlert;
use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Support\Toast;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class DonationController extends Controller
{
    public function index(Request $request)
    {
        $donations = QueryBuilder::for(Donation::with('streamer'))
            ->allowedFilters(
                AllowedFilter::partial('donor_name'),
                AllowedFilter::exact('streamer_id'),
            )
            ->defaultSort('-created_at')
            ->paginate()
            ->withQueryString()
            ->through(fn (Donation $donation) => [
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

        return inertia('admin/donations/index', [
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
    public function playDonationAlert(Donation $donation, BroadcastDonationAlert $broadcastDonationAlert)
    {
        if ($donation->streamer->queue_paused) {
            if (! $donation->in_queue) {
                $donation->update(['in_queue' => true]);
            }

            Toast::success('Adicionado à fila de alertas!');

            return back();
        }

        $broadcastDonationAlert->handle($donation);
        Toast::success('Alerta será reproduzido em breve!');

        return back();
    }
}
