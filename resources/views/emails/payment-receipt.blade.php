<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Receipt</title>
    <style>
        body { font-family: Arial, Helvetica, sans-serif; background: #f9fafb; margin: 0; padding: 24px; }
        .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .header { background: #10b981; color: #fff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; }
        .body { padding: 24px; color: #374151; }
        .detail { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
        .detail .label { color: #6b7280; }
        .detail .value { font-weight: 600; color: #111827; }
        .total { background: #f0fdf4; padding: 12px; border-radius: 8px; display: flex; justify-content: space-between; margin-top: 16px; }
        .total .amt { font-weight: 700; color: #059669; font-size: 18px; }
        .footer { text-align: center; color: #9ca3af; font-size: 12px; padding: 16px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>✅ Payment Successful</h1>
        </div>
        <div class="body">
            <h2 style="margin:0 0 8px;">Hello {{ $payment->user->name }},</h2>
            <p>Thank you for your payment. Here is your receipt:</p>

            <div class="detail"><span class="label">Event</span><span class="value">{{ $payment->ticket->event->name }}</span></div>
            <div class="detail"><span class="label">Transaction Ref</span><span class="value">{{ $payment->tx_ref }}</span></div>
            <div class="detail"><span class="label">Currency</span><span class="value">{{ $payment->currency }}</span></div>
            @if($payment->discount_amount > 0)
                <div class="detail"><span class="label">Discount</span><span class="value">- {{ number_format($payment->discount_amount, 2) }}</span></div>
            @endif
            <div class="detail"><span class="label">Date</span><span class="value">{{ $payment->paid_at ? $payment->paid_at->format('M d, Y g:i A') : now()->format('M d, Y g:i A') }}</span></div>

            <div class="total">
                <span>Total Paid</span>
                <span class="amt">{{ $payment->currency }} {{ number_format($payment->amount, 2) }}</span>
            </div>

            <p style="margin-top:16px; font-size:14px;">Your ticket is now active. Enjoy the event!</p>
        </div>
        <div class="footer">© {{ date('Y') }} EventHub. All rights reserved.</div>
    </div>
</body>
</html>
