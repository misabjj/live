<?php

namespace App\Http\Controllers;

use App\Actions\Donations\BlockDonor;
use App\Actions\Donations\CreateDonation;
use App\Actions\Donations\PlayAlert;
use App\Exceptions\DonationUnavailable;
use App\Http\Requests\StoreDonationRequest;
use App\Models\Donation;
use App\Models\User;
use App\Support\AuthenticatedUser;
use App\Support\Toast;
use Exception;
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
        $donations = QueryBuilder::for(app(AuthenticatedUser::class)->get()->donations()->approved())
            ->allowedFilters(AllowedFilter::partial('donor_name'))
            ->defaultSort('-created_at')
            ->paginate()
            ->withQueryString()
            ->through(fn (Donation $donation): array => [
                'id' => $donation->id,
                'donor_name' => $donation->donor_name,
                'amount' => $donation->amount,
                'currency' => $donation->currency->value,
                'created_at' => $donation->created_at,
                'content_type' => $donation->content_type->value,
                'content_text' => $donation->content_text,
                'content_path' => $donation->getContentUrl(),
            ]);

        return Inertia::render('donations/index', [
            'donations' => $donations,
            'filter' => [
                'donor_name' => $request->query('filter.donor_name', ''),
            ],
        ]);
    }

    /**
     * @throws \Throwable
     */
    public function store(StoreDonationRequest $request, User $streamer, CreateDonation $createDonation): RedirectResponse
    {
        try {
            $donation = $createDonation->handle($request, $streamer);
        } catch (DonationUnavailable $exception) {
            return back()->with('error', $exception->getMessage());
        }

        return to_route('donations.show', $donation);
    }

    public function show(Donation $donation): Response
    {
        if ($donation->isPending()) {
            return Inertia::render('donations/pending', [
                'donation' => [
                    'id' => $donation->id,
                    'donor_name' => $donation->donor_name,
                    'amount' => $donation->amount,
                    'content_type' => $donation->content_type,
                    'currency' => $donation->currency->value,
                    'status' => $donation->status->value,
                    'payment_reference' => $donation->payment_reference,
                    'payment_method' => $donation->payment_method,
                    'expires_at' => max(0, now()->diffInSeconds($donation->expires_at)),
                    'streamer' => [
                        'id' => $donation->streamer->id,
                        'name' => $donation->streamer->display_name,
                        'handle' => $donation->streamer->handle,
                        'avatar' => $donation->streamer->getProfilePhotoUrl(),
                        'background_image' => $donation->streamer->background_image,
                    ],
                ],
            ]);
        }

        if ($donation->isApproved()) {
            return Inertia::render('donations/approved', [
                'donation' => [
                    'id' => $donation->id,
                    'streamer' => [
                        'display_name' => $donation->streamer->display_name,
                        'handle' => $donation->streamer->handle,
                        'profile_photo' => $donation->streamer->getProfilePhotoUrl(),
                    ],
                ],
            ]);
        }

        if ($donation->isExpired()) {
            return Inertia::render('donations/expired', [
                'donation' => [
                    'id' => $donation->id,
                    'streamer' => [
                        'display_name' => $donation->streamer->display_name,
                        'handle' => $donation->streamer->handle,
                        'profile_photo' => $donation->streamer->getProfilePhotoUrl(),
                    ],
                ],
            ]);
        }

        abort(500);
    }

    /**
     * @throws \Throwable
     */
    public function playDonationAlert(Donation $donation, PlayAlert $playAlert): RedirectResponse
    {
        $this->authorize('update', $donation);

        app(AuthenticatedUser::class)->get();

        $wasBroadcast = $playAlert->handle($donation);
        Toast::success($wasBroadcast ? __('toasts.donation_alert_queued') : __('toasts.donation_alert_added_to_queue'));

        return back();
    }

    public function blockDonor(Donation $donation, BlockDonor $blockDonor): RedirectResponse
    {
        $donorName = $donation->donor_name;

        try {
            // This will soft delete the donation, effectively blocking the donor's message
            $blockDonor->handle($donation);

            Toast::warning(__('toasts.donor_blocked', ['name' => $donorName]));
        } catch (Exception $e) {
            Toast::error(__('toasts.donor_block_failed'));
        }

        return back();
    }
}
