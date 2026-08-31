<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\TicketType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketTypeController extends Controller
{
    public function index(Event $event)
    {
        return Inertia::render('Admin/TicketTypes/Index', [
            'event' => $event->load('ticketTypes'),
        ]);
    }

    public function store(Request $request, Event $event)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
        ]);

        $event->ticketTypes()->create($validated);

        return redirect()->back()->with('success', 'Ticket type created.');
    }

    public function update(Request $request, Event $event, TicketType $ticketType)
    {
        abort_unless($ticketType->event_id === $event->id, 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
        ]);

        $ticketType->update($validated);

        return redirect()->back()->with('success', 'Ticket type updated.');
    }

    public function destroy(Event $event, TicketType $ticketType)
    {
        abort_unless($ticketType->event_id === $event->id, 403);

        $ticketType->delete();

        return redirect()->back()->with('success', 'Ticket type deleted.');
    }
}
