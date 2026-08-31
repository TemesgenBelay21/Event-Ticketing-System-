<?php

namespace App\Mail;

use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EventReminder extends Mailable
{
    use Queueable, SerializesModels;

    public $event;
    public $ticket;

    public function __construct(Event $event, Ticket $ticket)
    {
        $this->event = $event;
        $this->ticket = $ticket;
    }

    public function build()
    {
        return $this->subject('Reminder: ' . $this->event->name . ' is tomorrow!')
            ->view('emails.event-reminder');
    }
}
