<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    /**
     * "My Tickets" page: upcoming events to browse, plus the
     * tickets this user already holds.
     */
    public function index(Request $request)
    {
        return Inertia::render('User/Tickets', [
            'events' => Event::where('event_date', '>=', now())
                ->orderBy('event_date')
                ->get(),
            'tickets' => $request->user()
                ->tickets()
                ->with('event')
                ->latest()
                ->get(),
        ]);
    }

    /**
     * "Get Ticket" — register the current user for an event.
     * One ticket per user per event.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => ['required', 'exists:events,id'],
        ]);

        $alreadyRegistered = Ticket::where('user_id', $request->user()->id)
            ->where('event_id', $validated['event_id'])
            ->exists();

        if ($alreadyRegistered) {
            return redirect()->back()->with('error', 'You already have a ticket for this event.');
        }

        Ticket::create([
            'user_id' => $request->user()->id,
            'event_id' => $validated['event_id'],
        ]);

        return redirect()->back()->with('success', 'Ticket booked! Check My Tickets below.');
    }

    /**
     * Server-rendered PDF version of a ticket, matching the
     * "PDF Ticket" download button in the design.
     */
    public function downloadPdf(Request $request, Ticket $ticket)
    {
        abort_unless($ticket->user_id === $request->user()->id, 403);

        $ticket->load('event', 'user');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('tickets.pdf', [
            'ticket' => $ticket,
        ]);

        return $pdf->download($ticket->barcode . '.pdf');
    }
}
