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
        ]);

        Event::create($validated);

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
