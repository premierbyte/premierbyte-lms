import apiClient from '@/lib/api-client';
import { Organization, UpdateOrganizationData } from '../types';

export const organizationsApi = {
  getOrganization: async () => {
    const response = await apiClient.get<{
      success: boolean;
      data: Organization;
    }>('/api/v1/organization');
    return response.data.data;
  },

  updateOrganization: async (data: UpdateOrganizationData) => {
    const response = await apiClient.put<{
      success: boolean;
      message: string;
      data: Organization;
    }>('/api/v1/organization', data);
    return response.data;
  },
};
