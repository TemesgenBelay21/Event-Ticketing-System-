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
        User::create([
            "name"=>"admin user",
            "email"=>"admin@admin.com",
            "role"=>"admin",
            "email_verified_at"=> now(),
            "password"=> Hash::make("password"),
        ]);

        User::create([
            "name"=>"user",
            "email"=>"user@example.com",
            "role"=>"user",
            "email_verified_at"=> now(),
            "password"=> Hash::make("password"),
        ]); 
    }
}
