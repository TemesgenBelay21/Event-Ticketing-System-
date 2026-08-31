<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Reminder</title>
    <style>
        body { font-family: Arial, Helvetica, sans-serif; background: #f9fafb; margin: 0; padding: 24px; }
        .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .header { background: #2563eb; color: #fff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; }
        .body { padding: 24px; color: #374151; }
        .body h2 { margin: 0 0 8px; color: #111827; }
        .info { background: #eff6ff; padding: 16px; border-radius: 8px; margin-top: 16px; }
        .info .row { margin-bottom: 6px; }
        .info .row .label { color: #6b7280; font-size: 13px; }
        .info .row .value { font-weight: 600; color: #111827; }
        .footer { text-align: center; color: #9ca3af; font-size: 12px; padding: 16px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>⏰ Don't Forget!</h1>
        </div>
        <div class="body">
            <h2>Hello {{ $ticket->user->name }},</h2>
            <p>Just a friendly reminder that your event starts tomorrow:</p>

            <div class="info">
                <div class="row"><span class="label">Event</span><br><span class="value">{{ $event->name }}</span></div>
                <div class="row"><span class="label">Date &amp; Time</span><br><span class="value">{{ $event->event_date->format('l, M d, Y g:i A') }}</span></div>
                @if($event->has('venue'))
                    <div class="row"><span class="label">Venue</span><br><span class="value">{{ $event->venue }}</span></div>
                @endif
                <div class="row"><span class="label">Ticket Barcode</span><br><span class="value">{{ $ticket->barcode }}</span></div>
            </div>

            <p style="margin-top:16px; font-size:14px;">
                Bring your digital pass or PDF ticket to the entrance. We can't wait to see you there!
            </p>
        </div>
        <div class="footer">© {{ date('Y') }} EventHub. All rights reserved.</div>
    </div>
</body>
</html>
