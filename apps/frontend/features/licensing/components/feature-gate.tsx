'use client';

import React from 'react';
import { useLicensing } from '../hooks/use-licensing';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({
  feature,
  children,
  fallback = null,
}: FeatureGateProps) {
  const { hasFeature, isLoading } = useLicensing();

  if (isLoading) {
    return null;
  }

  if (!hasFeature(feature)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
