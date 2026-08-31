<?php

namespace App\Console\Commands;

use App\Mail\EventReminder;
use App\Models\Ticket;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendEventReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'events:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send reminder emails to attendees of events occurring tomorrow';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $tickets = Ticket::whereHas('event', function ($q) {
            $q->whereDate('event_date', now()->addDay()->toDateString());
        })->with(['event', 'user'])->get();

        $sent = 0;
        foreach ($tickets as $ticket) {
            try {
                Mail::to($ticket->user)->send(new EventReminder($ticket->event, $ticket));
                $sent++;
            } catch (\Exception $e) {
                Log::warning("Reminder email failed for ticket {$ticket->id}: " . $e->getMessage());
            }
        }

        $this->info("Sent {$sent} reminder email(s).");

        return 0;
    }
}
