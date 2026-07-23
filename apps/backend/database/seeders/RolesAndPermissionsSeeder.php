<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions
        $permissions = [
            // Users management
            'users.view',
            'users.create',
            'users.update',
            'users.delete',

            // Roles & Permissions management
            'roles.view',
            'roles.manage',

            // Organizations / Tenants
            'organizations.view',
            'organizations.update',

            // Categories
            'categories.view',
            'categories.create',
            'categories.update',
            'categories.delete',

            // Courses
            'courses.view',
            'courses.create',
            'courses.update',
            'courses.delete',
            'courses.publish',

            // Sections & Lessons
            'sections.view',
            'sections.create',
            'sections.update',
            'sections.delete',
            'lessons.view',
            'lessons.create',
            'lessons.update',
            'lessons.delete',

            // Enrollments
            'enrollments.view',
            'enrollments.create',
            'enrollments.update',
            'enrollments.delete',

            // Quizzes
            'quizzes.view',
            'quizzes.create',
            'quizzes.update',
            'quizzes.delete',
            'quizzes.attempt',

            // Assignments
            'assignments.view',
            'assignments.create',
            'assignments.update',
            'assignments.delete',
            'assignments.submit',
            'assignments.grade',

            // Certificates
            'certificates.view',
            'certificates.create',
            'certificates.verify',
            'certificates.download',

            // Discussions
            'discussions.view',
            'discussions.create',
            'discussions.reply',
            'discussions.moderate',

            // Payments
            'payments.view',
            'payments.refund',

            // Settings
            'settings.view',
            'settings.update',

            // Audit Logs
            'audit_logs.view',
        ];

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        // Create roles and assign existing permissions

        // 1. Super Admin
        $superAdmin = Role::findOrCreate('Super Admin', 'web');
        // Super Admin gets all permissions implicitly via Gate::before in AppServiceProvider

        // 2. Administrator
        $admin = Role::findOrCreate('Administrator', 'web');
        $admin->givePermissionTo(Permission::all());

        // 3. Instructor
        $instructor = Role::findOrCreate('Instructor', 'web');
        $instructor->givePermissionTo([
            'users.view',
            'categories.view',
            'courses.view',
            'courses.create',
            'courses.update',
            'courses.delete',
            'courses.publish',
            'sections.view',
            'sections.create',
            'sections.update',
            'sections.delete',
            'lessons.view',
            'lessons.create',
            'lessons.update',
            'lessons.delete',
            'enrollments.view',
            'quizzes.view',
            'quizzes.create',
            'quizzes.update',
            'quizzes.delete',
            'assignments.view',
            'assignments.create',
            'assignments.update',
            'assignments.delete',
            'assignments.grade',
            'certificates.view',
            'certificates.create',
            'discussions.view',
            'discussions.create',
            'discussions.reply',
            'discussions.moderate',
        ]);

        // 4. Student
        $student = Role::findOrCreate('Student', 'web');
        $student->givePermissionTo([
            'categories.view',
            'courses.view',
            'sections.view',
            'lessons.view',
            'quizzes.view',
            'quizzes.attempt',
            'assignments.view',
            'assignments.submit',
            'certificates.view',
            'certificates.download',
            'discussions.view',
            'discussions.create',
            'discussions.reply',
        ]);

        // 5. Read Only
        $readOnly = Role::findOrCreate('Read Only', 'web');
        $readOnly->givePermissionTo([
            'users.view',
            'organizations.view',
            'categories.view',
            'courses.view',
            'sections.view',
            'lessons.view',
            'enrollments.view',
            'quizzes.view',
            'assignments.view',
            'certificates.view',
            'discussions.view',
            'payments.view',
            'settings.view',
        ]);
    }
}
