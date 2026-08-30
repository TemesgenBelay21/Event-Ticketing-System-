<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: sans-serif; text-align: center; padding: 30px; }
        .card { border: 1px solid #ddd; border-radius: 10px; padding: 24px; max-width: 380px; margin: 0 auto; }
        h1 { color: #4338ca; font-size: 20px; margin-bottom: 4px; }
        .date { color: #666; margin-bottom: 16px; }
        .row { text-align: left; margin-bottom: 10px; }
        .label { font-size: 10px; text-transform: uppercase; color: #999; }
        .value { font-weight: bold; }
        .qr { margin: 20px 0; }
        .code { letter-spacing: 2px; font-weight: bold; margin-top: 10px; }
        .hint { color: #888; font-size: 11px; margin-top: 4px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>{{ $ticket->event->name }}</h1>
        <div class="date">{{ $ticket->event->event_date->format('F j, Y \a\t g:i A') }}</div>

        <div class="row">
            <div class="label">Attendee</div>
            <div class="value">{{ $ticket->user->name }}</div>
        </div>
        <div class="row">
            <div class="label">Ticket ID</div>
            <div class="value">#{{ $ticket->id }}</div>
        </div>
        <div class="row">
            <div class="label">Description</div>
            <div class="value">{{ $ticket->event->description }}</div>
        </div>

        <div class="qr">
            {!! DNS2D::getBarcodeHTML($ticket->barcode, 'QRCODE', 4, 4) !!}
        </div>

        <div class="code">{{ $ticket->barcode }}</div>
        <div class="hint">Scan this code at the entrance</div>
    </div>
</body>
</html>
