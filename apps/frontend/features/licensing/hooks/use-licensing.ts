import { useQuery } from '@tanstack/react-query';
import { licensingApi } from '../api/licensing';

export function useLicensing() {
  const {
    data: status,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['licensing-status'],
    queryFn: licensingApi.getStatus,
    staleTime: 1000 * 60 * 15,
  });

  const hasFeature = (featureKey: string): boolean => {
    if (!status || status.in_restricted_mode || !status.valid) {
      return false;
    }
    return !!status.features[featureKey];
  };

  return {
    status,
    isLoading,
    isRestricted: status?.in_restricted_mode || !status?.valid,
    hasFeature,
  };
}
