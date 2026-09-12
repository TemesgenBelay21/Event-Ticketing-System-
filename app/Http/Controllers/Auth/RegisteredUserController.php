<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\AccountWelcome;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            // First account to register becomes admin so there's always
            // someone who can manage events; everyone after is a regular user.
            'role' => User::count() === 0 ? 'admin' : 'user',
        ]);

        try {
            Mail::to($user)->send(new AccountWelcome($user));
        } catch (\Exception $e) {
            Log::warning('Account welcome email failed: ' . $e->getMessage());
        }

        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
