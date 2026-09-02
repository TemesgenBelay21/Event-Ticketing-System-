<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Event;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Events/Index', [
            'events' => Event::with(['category:id,name,icon', 'ticketTypes:id,event_id,name,price,quantity'])
                ->withCount('tickets as registrations_count')
                ->orderBy('event_date')
                ->get(),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'event_date' => ['required', 'date'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'ticket_type_name' => ['nullable', 'string', 'max:255'],
            'ticket_type_price' => ['nullable', 'numeric', 'min:0'],
            'ticket_type_quantity' => ['nullable', 'integer', 'min:0'],
        ]);

        $event = Event::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'event_date' => $validated['event_date'],
            'category_id' => $validated['category_id'] ?? null,
        ]);

        // Optionally create the first ticket type with the event so it is
        // immediately available for purchase on the user side.
        if (!empty($validated['ticket_type_name'])) {
            $event->ticketTypes()->create([
                'name' => $validated['ticket_type_name'],
                'price' => $validated['ticket_type_price'] ?? 0,
                'quantity' => $validated['ticket_type_quantity'] ?? 0,
                'description' => 'Ticket type created with event.',
            ]);
        }

        return redirect()->back()->with('success', 'Event created.');
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'event_date' => ['required', 'date'],
            'category_id' => ['nullable', 'exists:categories,id'],
        ]);

        $event->update($validated);

        return redirect()->back()->with('success', 'Event updated.');
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return redirect()->back()->with('success', 'Event deleted.');
    }
}
