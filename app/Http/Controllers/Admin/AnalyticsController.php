<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Event;
use App\Models\Payment;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $months = (int) $request->get('months', 6);

        return Inertia::render('Admin/Analytics/Index', [
            'metrics' => $this->metrics(),
            'revenueOverTime' => $this->revenueOverTime($months),
            'ticketsOverTime' => $this->ticketsOverTime($months),
            'popularEvents' => $this->popularEvents(),
            'categoryBreakdown' => $this->categoryBreakdown(),
            'paymentMethods' => $this->paymentMethods(),
        ]);
    }

    private function metrics(): array
    {
        $totalRevenue = Payment::where('status', 'completed')->sum('amount');
        $totalDiscount = Payment::where('status', 'completed')->sum('discount_amount');
        $paidCount = Payment::where('status', 'completed')->count();
        $totalTicketCount = Ticket::count();

        return [
            'totalRevenue' => round($totalRevenue - $totalDiscount, 2),
            'avgTicketPrice' => $paidCount > 0 ? round(($totalRevenue - $totalDiscount) / $paidCount, 2) : 0,
            'ticketsSold' => $paidCount,
            'conversionRate' => $totalTicketCount > 0 ? round(($paidCount / $totalTicketCount) * 100, 1) : 0,
            'checkedIn' => Ticket::where('is_verified', true)->count(),
        ];
    }

    private function revenueOverTime(int $months): array
    {
        $start = Carbon::now()->subMonths($months - 1)->startOfMonth();
        $payments = Payment::where('status', 'completed')
            ->where('created_at', '>=', $start)
            ->get()
            ->groupBy(fn ($p) => $p->created_at->format('Y-m'));

        $labels = [];
        $data = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $key = $month->format('Y-m');
            $labels[] = $month->format('M Y');
            $data[] = round(($payments->get($key) ?? collect())->sum(fn ($p) => $p->amount - $p->discount_amount), 2);
        }

        return ['labels' => $labels, 'data' => $data];
    }

    private function ticketsOverTime(int $months): array
    {
        $start = Carbon::now()->subMonths($months - 1)->startOfMonth();
        $tickets = Ticket::where('created_at', '>=', $start)
            ->get()
            ->groupBy(fn ($t) => $t->created_at->format('Y-m'));

        $labels = [];
        $data = [];
        for ($i = $months - 1; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $key = $month->format('Y-m');
            $labels[] = $month->format('M Y');
            $data[] = ($tickets->get($key) ?? collect())->count();
        }

        return ['labels' => $labels, 'data' => $data];
    }

    private function popularEvents(): array
    {
        $events = Event::withCount('tickets as sold')
            ->withSum('tickets as revenue', 'amount_paid')
            ->orderBy('sold', 'desc')
            ->take(5)
            ->get()
            ->map(fn ($e) => [
                'name' => $e->name,
                'sold' => $e->sold,
                'revenue' => round($e->revenue, 2),
            ]);

        return $events->toArray();
    }

    private function categoryBreakdown(): array
    {
        $tickets = Ticket::with('event.category')
            ->get()
            ->groupBy(fn ($t) => $t->event->category->name ?? 'Uncategorized');

        return $tickets
            ->map(fn ($group) => ['name' => $group->first()['event']['category']['name'] ?? 'Uncategorized', 'value' => $group->count()])
            ->values()
            ->toArray();
    }

    private function paymentMethods(): array
    {
        return Payment::where('status', 'completed')
            ->whereNotNull('payment_method')
            ->get()
            ->groupBy('payment_method')
            ->map(fn ($group) => [
                'method' => $group->first()->payment_method,
                'count' => $group->count(),
                'total' => round($group->sum(fn ($p) => $p->amount - $p->discount_amount), 2),
            ])
            ->values()
            ->toArray();
    }
}
