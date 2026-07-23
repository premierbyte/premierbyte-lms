'use client';

import React from 'react';
import RouteGuard from '@/components/route-guard';
import CategoryList from '@/features/categories/components/category-list';

export default function CategoriesPage() {
  return (
    <RouteGuard requiredPermission="categories.view">
      <div className="w-full">
        <CategoryList />
      </div>
    </RouteGuard>
  );
}
