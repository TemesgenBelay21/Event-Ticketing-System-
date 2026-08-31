<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrganizerProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrganizerController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Organizers/Index', [
            'organizers' => OrganizerProfile::with('user')->orderBy('created_at')->get(),
        ]);
    }

    public function show(OrganizerProfile $organizerProfile)
    {
        return Inertia::render('Admin/Organizers/Show', [
            'organizer' => $organizerProfile->load('user'),
        ]);
    }

    public function assignRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', 'in:admin,organizer,user'],
        ]);

        $user->update($validated);

        if ($validated['role'] === 'organizer' && !$user->organizerProfile) {
            $user->organizerProfile()->create([
                'company_name' => $validated['company_name'] ?? $user->name,
            ]);
        }

        return redirect()->back()->with('success', 'Organizer role updated.');
    }

    public function update(Request $request, OrganizerProfile $organizerProfile)
    {
        $validated = $request->validate([
            'company_name' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'string', 'max:255'],
        ]);

        $organizerProfile->update($validated);

        return redirect()->back()->with('success', 'Organizer profile updated.');
    }

    public function destroy(OrganizerProfile $organizerProfile)
    {
        $user = $organizerProfile->user;
        if ($user && $user->role === 'organizer') {
            $user->update(['role' => 'user']);
        }
        $organizerProfile->delete();

        return redirect()->back()->with('success', 'Organizer removed.');
    }
}
