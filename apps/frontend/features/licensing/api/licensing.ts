import apiClient from '@/lib/api-client';
import { LicenseStatus } from '../types';

export const licensingApi = {
  getStatus: async () => {
    const response = await apiClient.get<{
      success: boolean;
      data: LicenseStatus;
    }>('/api/v1/licensing/status');
    return response.data.data;
  },

  getFeatures: async () => {
    const response = await apiClient.get<{
      success: boolean;
      data: { in_restricted_mode: boolean; features: Record<string, boolean> };
    }>('/api/v1/licensing/features');
    return response.data.data;
  },

  activate: async (licenseKey: string, domain: string) => {
    const response = await apiClient.post('/api/v1/licensing/activate', {
      license_key: licenseKey,
      domain: domain,
    });
    return response.data;
  },
};
