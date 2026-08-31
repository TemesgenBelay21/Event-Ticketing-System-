<?php

namespace App\Http\Controllers;

use App\Mail\TicketConfirmation;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\TicketType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
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
                ->with(['category:id,name,icon', 'ticketTypes:id,event_id,name,price,quantity'])
                ->orderBy('event_date')
                ->get(),
            'tickets' => $request->user()
                ->tickets()
                ->with(['event', 'ticketType'])
                ->latest()
                ->get(),
        ]);
    }

    /**
     * "Get Ticket" — register the current user for an event.
     * One ticket per user per event. If the selected ticket type has
     * a price, the ticket starts as pending payment and the user is
     * routed through the Chapa payment flow.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => ['required', 'exists:events,id'],
            'ticket_type_id' => ['required', 'exists:ticket_types,id'],
        ]);

        $ticketType = TicketType::with('event')->findOrFail($validated['ticket_type_id']);

        abort_unless($ticketType->event_id === (int) $validated['event_id'], 422);

        $alreadyRegistered = Ticket::where('user_id', $request->user()->id)
            ->where('event_id', $validated['event_id'])
            ->exists();

        if ($alreadyRegistered) {
            return redirect()->back()->with('error', 'You already have a ticket for this event.');
        }

        if ($ticketType->quantity > 0 && $ticketType->available <= 0) {
            return redirect()->back()->with('error', 'Sorry, this ticket type is sold out.');
        }

        $isPaid = $ticketType->price > 0;

        $ticket = Ticket::create([
            'user_id' => $request->user()->id,
            'event_id' => $validated['event_id'],
            'ticket_type_id' => $ticketType->id,
            'amount_paid' => $ticketType->price,
            'payment_status' => $isPaid ? 'pending' : 'free',
        ]);

        // Send confirmation email for the ticket
        try {
            Mail::to($request->user())->send(new TicketConfirmation($ticket));
        } catch (\Exception $e) {
            Log::warning('Ticket confirmation email failed: ' . $e->getMessage());
        }

        if ($isPaid) {
            return redirect()->route('payment.initialize', $ticket)
                ->with('success', 'Ticket reserved! Please complete payment.');
        }

        return redirect()->back()->with('success', 'Ticket booked! Check My Tickets below.');
    }

    /**
     * Server-rendered PDF version of a ticket, matching the
     * "PDF Ticket" download button in the design.
     */
    public function downloadPdf(Request $request, Ticket $ticket)
    {
        abort_unless($ticket->user_id === $request->user()->id, 403);

        $ticket->load('event', 'user', 'ticketType');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('tickets.pdf', [
            'ticket' => $ticket,
        ]);

        return $pdf->download($ticket->barcode . '.pdf');
    }
}
