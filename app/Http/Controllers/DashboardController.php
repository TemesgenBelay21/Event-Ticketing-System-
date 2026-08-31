<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Event;
use App\Models\Payment;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'totalEvents' => Event::count(),
                    'totalUsers' => User::count(),
                    'totalTickets' => Ticket::count(),
                    'totalCategories' => Category::count(),
                    'totalRevenue' => round(
                        Payment::where('status', 'completed')->sum('amount')
                        - Payment::where('status', 'completed')->sum('discount_amount'),
                        2
                    ),
                ],
            ]);
        }

        if ($user->isOrganizer()) {
            return Inertia::render('Organizer/Dashboard', [
                'events' => Event::with(['category:id,name,icon', 'ticketTypes'])
                    ->withCount('tickets as registrations_count')
                    ->orderBy('event_date')
                    ->get(),
            ]);
        }

        return Inertia::render('User/Dashboard');
    }
}
