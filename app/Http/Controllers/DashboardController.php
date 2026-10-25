<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $now = now();
        $startDate = $now->copy()->subDays(30);
        $previousStartDate = $startDate->copy()->subDays(30);

        // Current period (last 30 days)
        $donationsReceived = $user->donations()->approvedThirtyDaysAgo()->count();
        $totalBilled = $user->donations()->approvedThirtyDaysAgo()->sum('amount');

        // Previous period (30-60 days ago)
        $previousDonationsReceived = $user->donations()
            ->approved()
            ->where('approved_at', '>=', $previousStartDate)
            ->where('approved_at', '<', $startDate)
            ->count();

        $previousTotalBilled = $user->donations()
            ->approved()
            ->where('approved_at', '>=', $previousStartDate)
            ->where('approved_at', '<', $startDate)
            ->sum('amount');

        // Calculate percentage changes
        $donationsChange = $previousDonationsReceived > 0
            ? round((($donationsReceived - $previousDonationsReceived) / $previousDonationsReceived) * 100, 1)
            : ($donationsReceived > 0 ? 100 : 0);

        $billingChange = $previousTotalBilled > 0
            ? round((($totalBilled - $previousTotalBilled) / $previousTotalBilled) * 100, 1)
            : ($totalBilled > 0 ? 100 : 0);

        // Calculate average donation and its change
        $averageAmount = $donationsReceived > 0 ? $totalBilled / $donationsReceived : 0;
        $previousAverageAmount = $previousDonationsReceived > 0 ? $previousTotalBilled / $previousDonationsReceived : 0;

        $averageChange = $previousAverageAmount > 0
            ? round((($averageAmount - $previousAverageAmount) / $previousAverageAmount) * 100, 1)
            : ($averageAmount > 0 ? 100 : 0);

        // Chart data - donations by day for current month
        $monthStart = $now->copy()->startOfMonth();
        $chartData = Donation::where('streamer_id', $user->id)
            ->approved()
            ->where('approved_at', '>=', $monthStart)
            ->select([
                DB::raw('DATE(approved_at) as date'),
                DB::raw('SUM(amount) as total'),
                DB::raw('COUNT(*) as count'),
            ])
            ->groupBy(DB::raw('DATE(approved_at)'))
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'total' => (float) $item->total,
                    'count' => (int) $item->count,
                ];
            });

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
