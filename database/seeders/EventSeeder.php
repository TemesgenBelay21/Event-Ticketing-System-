<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $events = [
            [
                'name' => 'Tech Conference 2026',
                'description' => 'A gathering of tech enthusiasts and professionals to discuss the latest in software and hardware.',
                'event_date' => now()->addDays(30)->setTime(10, 0),
            ],
            [
                'name' => 'Music Festival',
                'description' => 'A weekend of live music, food, and fun.',
                'event_date' => now()->addDays(60)->setTime(17, 0),
            ],
            [
                'name' => 'Art Exhibition',
                'description' => 'Showcasing the works of local and international artists.',
                'event_date' => now()->addDays(15)->setTime(11, 0),
            ],
            [
                'name' => 'Startup Summit',
                'description' => 'Networking and pitching for startups and investors.',
                'event_date' => now()->addDays(45)->setTime(9, 0),
            ],
            [
                'name' => 'Charity Gala',
                'description' => 'Fundraising event for local charities.',
                'event_date' => now()->addDays(90)->setTime(19, 0),
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
