<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            [
                "name" => "admin user",
                "role" => "admin",
                "email_verified_at" => now(),
                "password" => Hash::make("password"),
            ]
        );

        User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                "name" => "user",
                "role" => "user",
                "email_verified_at" => now(),
                "password" => Hash::make("password"),
            ]
        );

        $organizer = User::firstOrCreate(
            ['email' => 'organizer@example.com'],
            [
                "name" => "Event Organizer",
                "role" => "organizer",
                "email_verified_at" => now(),
                "password" => Hash::make("password"),
            ]
        );

        if (!$organizer->organizerProfile) {
            $organizer->organizerProfile()->create([
                'company_name' => 'EventHub Productions',
                'bio' => 'Professional event management company.',
                'phone' => '+251911223344',
                'website' => 'https://example.com',
            ]);
        }
    }
}
