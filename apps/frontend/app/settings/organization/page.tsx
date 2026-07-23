'use client';

import React from 'react';
import RouteGuard from '@/components/route-guard';
import { FeatureGate } from '@/features/licensing/components/feature-gate';
import OrganizationForm from '@/features/organizations/components/organization-form';

export default function OrganizationSettingsPage() {
  return (
    <RouteGuard requiredPermission="organizations.view">
      <div className="w-full">
        <FeatureGate
          feature="organizations"
          fallback={
            <div className="mx-auto my-12 w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-2xl">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m0-8v6m0 5h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-100">
                Multi-Tenant Organizations Disabled
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                The Organization Management module requires an active license
                with the{' '}
                <span className="font-semibold text-indigo-400">
                  organizations
                </span>{' '}
                feature flag enabled.
              </p>
            </div>
          }
        >
          <OrganizationForm />
        </FeatureGate>
      </div>
    </RouteGuard>
  );
}
