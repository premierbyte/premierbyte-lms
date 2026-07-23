'use client';

import React, { Suspense } from 'react';
import ResetPasswordForm from '@/features/auth/components/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background lights decoration */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      <Suspense fallback={<div className="text-slate-400">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
