'use client';

import React from 'react';
import { useLicensing } from '../hooks/use-licensing';

export function RestrictedBanner() {
  const { status, isRestricted, isLoading } = useLicensing();

  if (isLoading || !isRestricted) {
    return null;
  }

  return (
    <div className="flex w-full items-center justify-between border-b border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-300">
      <div className="flex items-center space-x-2">
        <svg
          className="h-5 w-5 shrink-0 text-amber-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>
          {status?.message ||
            'Platform is operating in Restricted Mode due to unverified or expired license.'}{' '}
          Premium features are currently disabled.
        </span>
      </div>
      <a
        href="https://premierbyte.com/renew"
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-lg bg-amber-500 px-3 py-1 text-xs font-semibold text-slate-950 transition-colors hover:bg-amber-400"
      >
        Renew License
      </a>
    </div>
  );
}
