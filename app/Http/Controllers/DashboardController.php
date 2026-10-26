<?php

namespace App\Http\Controllers;

use App\Support\AuthenticatedUser;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function show(): Response
    {
        $user = app(AuthenticatedUser::class)->get();
        $now = now();
        $startDate = $now->copy()->subDays(30);
        $previousStartDate = $startDate->copy()->subDays(30);

        $donationsReceived = $user->donations()->approvedThirtyDaysAgo()->count();
        $totalBilled = (float) $user->donations()->approvedThirtyDaysAgo()->sum('amount');
        $previousDonationsReceived = $user->donations()
            ->approved()
            ->where('approved_at', '>=', $previousStartDate)
            ->where('approved_at', '<', $startDate)
            ->count();
        $previousTotalBilled = (float) $user->donations()
            ->approved()
            ->where('approved_at', '>=', $previousStartDate)
            ->where('approved_at', '<', $startDate)
            ->sum('amount');

        $donationsChange = $previousDonationsReceived > 0
            ? round((($donationsReceived - $previousDonationsReceived) / $previousDonationsReceived) * 100, 1)
            : ($donationsReceived > 0 ? 100 : 0);
        $billingChange = $previousTotalBilled > 0
            ? round((($totalBilled - $previousTotalBilled) / $previousTotalBilled) * 100, 1)
            : ($totalBilled > 0 ? 100 : 0);
        $averageAmount = $donationsReceived > 0 ? $totalBilled / $donationsReceived : 0;
        $previousAverageAmount = $previousDonationsReceived > 0 ? $previousTotalBilled / $previousDonationsReceived : 0;
        $averageChange = $previousAverageAmount > 0
            ? round((($averageAmount - $previousAverageAmount) / $previousAverageAmount) * 100, 1)
            : ($averageAmount > 0 ? 100 : 0);

        $chartData = DB::table('donations')
            ->where('streamer_id', $user->id)
            ->where('status', 'approved')
            ->where('approved_at', '>=', $now->copy()->startOfMonth())
            ->select([
                DB::raw('DATE(approved_at) as date'),
                DB::raw('SUM(amount) as total'),
                DB::raw('COUNT(*) as count'),
            ])
            ->groupBy(DB::raw('DATE(approved_at)'))
            ->orderBy('date')
            ->get()
            ->map(fn (object $item): array => [
                'date' => $item->date,
                'total' => (float) $item->total,
                'count' => (int) $item->count,
            ]);

        return Inertia::render('streamers/dashboard', [
            'stats' => [
                'donations_received' => $donationsReceived,
                'total_billed' => number_format($totalBilled, 2, ',', '.'),
                'average_amount' => number_format($averageAmount, 2, ',', '.'),
                'donations_change' => $donationsChange,
                'billing_change' => $billingChange,
                'average_change' => $averageChange,
                'chart_data' => $chartData,
            ],
        ]);
    }
}
