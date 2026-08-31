<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\DiscountCode;
use App\Models\Event;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run()
    {
        // Ensure categories exist before assigning them.
        $this->call(CategorySeeder::class);

        $categories = Category::pluck('id', 'slug');

        $events = [
            [
                'name' => 'Tech Conference 2026',
                'description' => 'A gathering of tech enthusiasts and professionals to discuss the latest in software and hardware.',
                'event_date' => now()->addDays(30)->setTime(10, 0),
                'category_slug' => 'technology',
            ],
            [
                'name' => 'Music Festival',
                'description' => 'A weekend of live music, food, and fun.',
                'event_date' => now()->addDays(60)->setTime(17, 0),
                'category_slug' => 'music',
            ],
            [
                'name' => 'Art Exhibition',
                'description' => 'Showcasing the works of local and international artists.',
                'event_date' => now()->addDays(15)->setTime(11, 0),
                'category_slug' => 'arts-culture',
            ],
            [
                'name' => 'Startup Summit',
                'description' => 'Networking and pitching for startups and investors.',
                'event_date' => now()->addDays(45)->setTime(9, 0),
                'category_slug' => 'business',
            ],
            [
                'name' => 'Charity Gala',
                'description' => 'Fundraising event for local charities.',
                'event_date' => now()->addDays(90)->setTime(19, 0),
                'category_slug' => 'charity',
            ],
        ];

        foreach ($events as $event) {
            $created = Event::firstOrCreate(
                ['name' => $event['name']],
                [
                    'name' => $event['name'],
                    'description' => $event['description'],
                    'event_date' => $event['event_date'],
                    'category_id' => $categories[$event['category_slug']] ?? null,
                ]
            );

            // Seed a couple of ticket types per event.
            $ticketTypes = [
                ['name' => 'General Admission', 'price' => 200, 'quantity' => 100, 'description' => 'Standard entry ticket.'],
                ['name' => 'VIP', 'price' => 500, 'quantity' => 50, 'description' => 'VIP access with perks.'],
            ];

            foreach ($ticketTypes as $type) {
                $exists = $created->ticketTypes()->where('name', $type['name'])->exists();
                if (!$exists) {
                    $created->ticketTypes()->create($type);
                }
            }

            // Seed a sample discount code for the first few events.
            if (in_array($event['name'], ['Tech Conference 2026', 'Music Festival'])) {
                $code = strtoupper(substr($event['name'], 0, 3)) . '10';
                if (!DiscountCode::where('code', $code)->exists()) {
                    DiscountCode::create([
                        'code' => $code,
                        'type' => 'percentage',
                        'value' => 10,
                        'event_id' => $created->id,
                        'max_uses' => 100,
                        'active' => true,
                    ]);
                }
            }
        }
    }
}
