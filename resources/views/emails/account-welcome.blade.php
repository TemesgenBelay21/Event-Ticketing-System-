<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to EventHub</title>
    <style>
        body { font-family: Arial, Helvetica, sans-serif; background: #f9fafb; margin: 0; padding: 24px; }
        .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .header { background: #ef4444; color: #fff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; }
        .body { padding: 24px; color: #374151; }
        .body h2 { margin: 0 0 8px; color: #111827; }
        .footer { text-align: center; color: #9ca3af; font-size: 12px; padding: 16px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>Welcome to EventHub</h1>
        </div>
        <div class="body">
            <h2>Hello {{ $user->name }},</h2>
            <p>You have successfully registered to EventHub. Your account is ready.</p>
            <p>Browse upcoming events, book tickets, and manage everything from your dashboard.</p>
        </div>
        <div class="footer">© {{ date('Y') }} EventHub. All rights reserved.</div>
    </div>
</body>
</html>