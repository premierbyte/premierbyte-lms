<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions
        $this->call(RolesAndPermissionsSeeder::class);

        // Create a test Administrator user
        $admin = User::factory()->create([
            'first_name' => 'Test',
            'last_name' => 'Admin',
            'username' => 'testadmin',
            'email' => 'admin@example.com',
        ]);
        $admin->assignRole('Administrator');

        // Create a test Student user
        $student = User::factory()->create([
            'first_name' => 'Test',
            'last_name' => 'Student',
            'username' => 'teststudent',
            'email' => 'student@example.com',
        ]);
        $student->assignRole('Student');
    }
}
