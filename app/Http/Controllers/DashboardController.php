<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->isAdmin()) {
            return Inertia::render('Admin/Dashboard', [
                'stats' => [
                    'totalEvents' => Event::count(),
                    'totalUsers' => User::count(),
                    'totalTickets' => Ticket::count(),
                ],
            ]);
        }

        return Inertia::render('User/Dashboard');
    }
}
