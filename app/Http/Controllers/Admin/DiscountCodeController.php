<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DiscountCode;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscountCodeController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/DiscountCodes/Index', [
            'discountCodes' => DiscountCode::with('event:id,name')->orderBy('created_at')->get(),
            'events' => Event::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:discount_codes,code'],
            'type' => ['required', 'in:percentage,fixed'],
            'value' => ['required', 'numeric', 'min:0'],
            'event_id' => ['nullable', 'exists:events,id'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'expires_at' => ['nullable', 'date'],
            'active' => ['boolean'],
        ]);

        if ($validated['type'] === 'percentage' && $validated['value'] > 100) {
            return redirect()->back()->with('error', 'Percentage discount cannot exceed 100.');
        }

        $validated['code'] = strtoupper($validated['code']);
        $validated['active'] = $validated['active'] ?? true;

        DiscountCode::create($validated);

        return redirect()->back()->with('success', 'Discount code created.');
    }

    public function update(Request $request, DiscountCode $discountCode)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50', 'unique:discount_codes,code,' . $discountCode->id],
            'type' => ['required', 'in:percentage,fixed'],
            'value' => ['required', 'numeric', 'min:0'],
            'event_id' => ['nullable', 'exists:events,id'],
            'max_uses' => ['nullable', 'integer', 'min:1'],
            'expires_at' => ['nullable', 'date'],
            'active' => ['boolean'],
        ]);

        if ($validated['type'] === 'percentage' && $validated['value'] > 100) {
            return redirect()->back()->with('error', 'Percentage discount cannot exceed 100.');
        }

        $validated['code'] = strtoupper($validated['code']);
        $validated['active'] = $validated['active'] ?? true;

        $discountCode->update($validated);

        return redirect()->back()->with('success', 'Discount code updated.');
    }

    public function destroy(DiscountCode $discountCode)
    {
        $discountCode->delete();

        return redirect()->back()->with('success', 'Discount code deleted.');
    }
}
