<?php

namespace App\Http\Controllers;

use App\Mail\PaymentReceipt;
use App\Models\DiscountCode;
use App\Models\Payment;
use App\Models\Ticket;
use Chapa\Chapa\Facades\Chapa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Initialize a Chapa payment for a ticket that has an outstanding
     * balance (i.e. a paid ticket type that hasn't been paid yet).
     */
    public function initialize(Request $request, Ticket $ticket)
    {
        abort_unless($ticket->user_id === $request->user()->id, 403);

        if ($ticket->payment_status !== 'pending') {
            return redirect()->route('tickets.index')->with('error', 'This ticket has no pending payment.');
        }

        $price = $ticket->amount_paid;
        $discount = 0;

        // Optional discount code
        if ($code = $request->get('discount_code')) {
            $discountCode = DiscountCode::where('code', strtoupper($code))->first();

            if ($discountCode && $discountCode->isValid($price)) {
                if ($discountCode->event_id && $discountCode->event_id !== $ticket->event_id) {
                    return back()->with('error', 'This discount code does not apply to this event.');
                }
                $discount = $discountCode->applyDiscount($price);
            }
        }

        $amount = max(0, $price - $discount);
        $reference = Chapa::generateReference();

        $payment = Payment::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'discount_code_id' => $discountCode->id ?? null,
            'amount' => $amount,
            'discount_amount' => $discount,
            'currency' => 'ETB',
            'tx_ref' => $reference,
            'status' => 'pending',
        ]);

        $data = [
            'amount' => $amount,
            'email' => $request->user()->email,
            'first_name' => explode(' ', $request->user()->name)[0],
            'last_name' => count(explode(' ', $request->user()->name)) > 1 ? explode(' ', $request->user()->name)[1] : '',
            'tx_ref' => $reference,
            'currency' => 'ETB',
            'callback_url' => route('payment.callback', $reference),
            'return_url' => route('payment.success'),
            'customization' => [
                'title' => 'EventHub Ticket Payment',
                'description' => 'Payment for ' . ($ticket->event->name ?? 'event ticket'),
            ],
        ];

        try {
            $response = Chapa::initializePayment($data);

            if (($response['status'] ?? '') !== 'success') {
                $payment->update(['status' => 'failed']);
                return back()->with('error', $response['message'] ?? 'Payment initialization failed.');
            }

            $payment->update(['status' => 'pending']);
            return \Inertia\Inertia::location($response['data']['checkout_url']);
        } catch (\Exception $e) {
            Log::error('Chapa init failed: ' . $e->getMessage());
            $payment->update(['status' => 'failed']);
            return back()->with('error', 'Could not reach the payment provider. Please try again.');
        }
    }

    /**
     * Server-side callback called by Chapa after payment. Always
     * re-verify server-side before trusting the result.
     */
    public function callback(Request $request, string $reference)
    {
        $payment = Payment::where('tx_ref', $reference)->first();

        if (!$payment) {
            return redirect()->route('tickets.index')->with('error', 'Payment not found.');
        }

        $verification = Chapa::verifyTransaction($reference);

        if (($verification['status'] ?? '') === 'success') {
            $payment->update([
                'status' => 'completed',
                'chapa_ref' => $verification['data']['reference'] ?? $payment->chapa_ref,
                'payment_method' => $verification['data']['payment_type'] ?? null,
                'paid_at' => now(),
            ]);

            $ticket = $payment->ticket;
            if ($ticket) {
                $ticket->update([
                    'payment_status' => 'paid',
                    'amount_paid' => $payment->amount,
                ]);

                if ($payment->discountCode) {
                    $payment->discountCode->incrementUsage();
                }
            }

            try {
                Mail::to($payment->user)->send(new PaymentReceipt($payment));
            } catch (\Exception $e) {
                Log::warning('Receipt email failed: ' . $e->getMessage());
            }

            return redirect()->route('payment.success', ['ref' => $payment->tx_ref])
                ->with('success', 'Payment completed successfully!');
        }

        $payment->update(['status' => 'failed']);

        return redirect()->route('tickets.index')->with('error', 'Payment was not successful.');
    }

    /**
     * Browser return URL after completing payment on Chapa's checkout.
     * Shows a confirmation page regardless of outcome; the callback
     * performs the authoritative update.
     */
    public function success(Request $request)
    {
        return Inertia::render('User/Payment/Success', [
            'reference' => $request->get('ref'),
            'flash' => session()->only(['success', 'error']),
        ]);
    }

    /**
     * Chapa webhook handler (POST). Verifies the HMAC signature and
     * updates the payment status for async payment confirmations.
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('x-chapa-signature');
        $expectedHash = hash_hmac('sha256', $payload, (string) config('chapa.secretKey'));

        if (!$signature || !hash_equals($expectedHash, $signature)) {
            return response()->json(['status' => 'invalid signature'], 403);
        }

        $event = json_decode($payload, true);

        if (($event['event'] ?? '') === 'charge.success' && !empty($event['tx_ref'])) {
            $payment = Payment::where('tx_ref', $event['tx_ref'])->first();

            if ($payment && $payment->status !== 'completed') {
                $payment->update([
                    'status' => 'completed',
                    'chapa_ref' => $event['reference'] ?? $payment->chapa_ref,
                    'payment_method' => $event['payment_method'] ?? null,
                    'paid_at' => $event['updated_at'] ? \Carbon\Carbon::parse($event['updated_at']) : now(),
                ]);

                $ticket = $payment->ticket;
                if ($ticket) {
                    $ticket->update(['payment_status' => 'paid']);

                    if ($payment->discountCode) {
                        $payment->discountCode->incrementUsage();
                    }
                }

                try {
                    Mail::to($payment->user)->send(new PaymentReceipt($payment));
                } catch (\Exception $e) {
                    Log::warning('Webhook receipt email failed: ' . $e->getMessage());
                }
            }
        }

        return response()->json(['status' => 'ok']);
    }

    /**
     * Validate a discount code for a given ticket price before payment.
     */
    public function validateDiscount(Request $request)
    {
        $validated = $request->validate([
            'code' => ['required', 'string'],
            'event_id' => ['required', 'exists:events,id'],
            'amount' => ['required', 'numeric', 'min:0'],
        ]);

        $discountCode = DiscountCode::where('code', strtoupper($validated['code']))->first();

        if (!$discountCode || !$discountCode->isValid($validated['amount'])) {
            return response()->json(['valid' => false, 'message' => 'Invalid or expired discount code.']);
        }

        if ($discountCode->event_id && $discountCode->event_id !== (int) $validated['event_id']) {
            return response()->json(['valid' => false, 'message' => 'This code does not apply to this event.']);
        }

        $discount = $discountCode->applyDiscount($validated['amount']);
        $newTotal = max(0, $validated['amount'] - $discount);

        return response()->json([
            'valid' => true,
            'discount' => $discount,
            'newTotal' => $newTotal,
            'type' => $discountCode->type,
        ]);
    }
}
