<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            ['name' => 'Technology', 'slug' => 'technology', 'description' => 'Tech conferences, summits, and meetups.', 'icon' => '💻'],
            ['name' => 'Music', 'slug' => 'music', 'description' => 'Concerts, festivals, and live performances.', 'icon' => '🎵'],
            ['name' => 'Arts & Culture', 'slug' => 'arts-culture', 'description' => 'Exhibitions, galleries, and cultural events.', 'icon' => '🎨'],
            ['name' => 'Business', 'slug' => 'business', 'description' => 'Conferences, summits, and networking.', 'icon' => '💼'],
            ['name' => 'Charity', 'slug' => 'charity', 'description' => 'Fundraising and community events.', 'icon' => '🤝'],
            ['name' => 'Education', 'slug' => 'education', 'description' => 'Workshops, seminars, and training.', 'icon' => '🎓'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
