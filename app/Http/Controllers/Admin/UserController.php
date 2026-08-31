<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::with('organizerProfile')
                ->orderBy('created_at')
                ->get(['id', 'name', 'email', 'role', 'created_at']),
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', 'in:admin,organizer,user'],
            'company_name' => ['nullable', 'string', 'max:255'],
        ]);

        // Don't let an admin accidentally strand the app with zero admins.
        if ($user->role === 'admin' && $validated['role'] !== 'admin' && User::where('role', 'admin')->count() <= 1) {
            return redirect()->back()->with('error', 'At least one admin must remain.');
        }

        $user->update(['role' => $validated['role']]);

        if ($validated['role'] === 'organizer') {
            $user->organizerProfile()->updateOrCreate(
                [],
                ['company_name' => $validated['company_name'] ?? $user->name]
            );
        } elseif ($validated['role'] !== 'organizer' && $user->organizerProfile) {
            $user->organizerProfile()->delete();
        }

        return redirect()->back()->with('success', 'Role updated.');
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted.');
    }
}
