<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket Confirmation</title>
    <style>
        body { font-family: Arial, Helvetica, sans-serif; background: #f9fafb; margin: 0; padding: 24px; }
        .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .header { background: #ef4444; color: #fff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; }
        .body { padding: 24px; color: #374151; }
        .body h2 { margin: 0 0 8px; color: #111827; }
        .detail { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
        .detail .label { color: #6b7280; }
        .detail .value { font-weight: 600; color: #111827; }
        .barcode { text-align: center; margin-top: 16px; padding: 12px; background: #f9fafb; border-radius: 8px; font-family: monospace; font-size: 14px; color: #111827; }
        .footer { text-align: center; color: #9ca3af; font-size: 12px; padding: 16px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>🎟️ Ticket Confirmed</h1>
        </div>
        <div class="body">
            <h2>Hello {{ $ticket->user->name }},</h2>
            <p>Your ticket has been booked successfully. Here are your details:</p>

            <div class="detail"><span class="label">Event</span><span class="value">{{ $ticket->event->name }}</span></div>
            <div class="detail"><span class="label">Date</span><span class="value">{{ $ticket->event->event_date->format('M d, Y g:i A') }}</span></div>
            @if($ticket->ticketType)
                <div class="detail"><span class="label">Ticket Type</span><span class="value">{{ $ticket->ticketType->name }}</span></div>
                <div class="detail"><span class="label">Price</span><span class="value">ETB {{ number_format($ticket->amount_paid, 2) }}</span></div>
            @endif
            <div class="detail"><span class="label">Status</span><span class="value">{{ ucfirst($ticket->payment_status) }}</span></div>

            <div class="barcode">Barcode: {{ $ticket->barcode }}</div>

            <p style="margin-top:16px; font-size:14px;">
                Present your digital pass at the entrance. You can view and download it from your EventHub account.
            </p>
        </div>
        <div class="footer">© {{ date('Y') }} EventHub. All rights reserved.</div>
    </div>
</body>
</html>
