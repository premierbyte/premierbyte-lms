'use client';

import React from 'react';
import RouteGuard from '@/components/route-guard';
import CourseList from '@/features/courses/components/course-list';

export default function CoursesPage() {
  return (
    <RouteGuard requiredPermission="courses.view">
      <div className="w-full">
        <CourseList />
      </div>
    </RouteGuard>
  );
}
