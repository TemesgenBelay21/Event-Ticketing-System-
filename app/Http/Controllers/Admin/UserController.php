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
            'users' => User::orderBy('created_at')->get(['id', 'name', 'email', 'role', 'created_at']),
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', 'in:admin,user'],
        ]);

        // Don't let an admin accidentally strand the app with zero admins.
        if ($user->role === 'admin' && $validated['role'] === 'user' && User::where('role', 'admin')->count() <= 1) {
            return redirect()->back()->with('error', 'At least one admin must remain.');
        }

        $user->update($validated);

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
