<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Payment;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->get('from');
        $to = $request->get('to');

        $payments = Payment::query()
            ->when($from, fn ($q) => $q->where('created_at', '>=', $from))
            ->when($to, fn ($q) => $q->where('created_at', '<=', $to))
            ->where('status', 'completed')
            ->get();

        $totalRevenue = $payments->sum('amount');
        $totalDiscount = $payments->sum('discount_amount');

        $eventRevenue = Payment::query()
            ->with('ticket')
            ->where('status', 'completed')
            ->when($from, fn ($q) => $q->where('created_at', '>=', $from))
            ->when($to, fn ($q) => $q->where('created_at', '<=', $to))
            ->get()
            ->groupBy(fn ($p) => $p->ticket->event_id);

        $events = Event::withCount('tickets as registrations')
            ->withCount(['tickets as checked_in' => function ($q) {
                $q->where('is_verified', true);
            }])
            ->get()
            ->map(function ($event) use ($eventRevenue) {
                $event->revenue = ($eventRevenue->get($event->id) ?? collect())
                    ->sum(fn ($p) => $p->amount - $p->discount_amount);
                $event->checked_in_rate = $event->registrations > 0
                    ? round(($event->checked_in / $event->registrations) * 100, 1)
                    : 0;
                return $event;
            });

        return Inertia::render('Admin/Reports/Index', [
            'summary' => [
                'totalRevenue' => $totalRevenue,
                'totalDiscount' => $totalDiscount,
                'totalTicketsSold' => $payments->count(),
                'avgTicketPrice' => $payments->count() > 0
                    ? round($totalRevenue / $payments->count(), 2)
                    : 0,
                'checkedIn' => Ticket::where('is_verified', true)->count(),
                'totalTickets' => Ticket::count(),
            ],
            'events' => $events,
            'filters' => $request->only(['from', 'to']),
        ]);
    }

    public function export(Request $request)
    {
        $format = $request->get('format', 'csv');
        $from = $request->get('from');
        $to = $request->get('to');

        $payments = Payment::with(['ticket', 'user', 'ticket.event', 'discountCode'])
            ->when($from, fn ($q) => $q->where('created_at', '>=', $from))
            ->when($to, fn ($q) => $q->where('created_at', '<=', $to))
            ->orderBy('created_at')
            ->get();

        $filename = 'revenue-report-' . now()->format('Y-m-d') . '.' . $format;

        if ($format === 'json') {
            return response()->json($payments);
        }

        $csv = fopen('php://temp', 'r+');
        fputcsv($csv, ['Transaction Ref', 'Event', 'Customer', 'Amount', 'Discount', 'Currency', 'Status', 'Date']);

        foreach ($payments as $payment) {
            fputcsv($csv, [
                $payment->tx_ref,
                $payment->ticket->event->name ?? 'N/A',
                $payment->user->name ?? 'N/A',
                $payment->amount,
                $payment->discount_amount,
                $payment->currency,
                $payment->status,
                $payment->created_at ? $payment->created_at->toDateTimeString() : null,
            ]);
        }

        rewind($csv);
        $csvContent = stream_get_contents($csv);
        fclose($csv);

        return response($csvContent)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', "attachment; filename=\"$filename\"");
    }
}
