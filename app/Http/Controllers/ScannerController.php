<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScannerController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Scanner');
    }

    /**
     * Called with the text decoded from a ticket's QR code.
     * Marks the ticket verified the first time; flags repeat/invalid scans.
     */
    public function verify(Request $request)
    {
        $validated = $request->validate([
            'barcode' => ['required', 'string'],
        ]);

        $ticket = Ticket::with('event', 'user')->where('barcode', $validated['barcode'])->first();

        if (! $ticket) {
            return response()->json([
                'status' => 'invalid',
                'message' => 'No ticket found with this code.',
            ], 404);
        }

        if ($ticket->is_verified) {
            return response()->json([
                'status' => 'duplicate',
                'message' => 'This ticket has already been used.',
                'ticket' => [
                    'event' => $ticket->event->name,
                    'attendee' => $ticket->user->name,
                    'verified_at' => optional($ticket->verified_at)->format('M j, Y g:i A'),
                ],
            ], 409);
        }

        $ticket->update([
            'is_verified' => true,
            'verified_at' => now(),
        ]);

        return response()->json([
            'status' => 'valid',
            'message' => 'Ticket verified. Entry granted.',
            'ticket' => [
                'event' => $ticket->event->name,
                'attendee' => $ticket->user->name,
            ],
        ]);
    }
}
