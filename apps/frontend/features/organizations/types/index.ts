export interface Organization {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  timezone: string;
  locale: string;
  logo?: string | null;
  favicon?: string | null;
  primary_color: string;
  secondary_color: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at?: string;
  updated_at?: string;
}

export type UpdateOrganizationData = Omit<
  Organization,
  'id' | 'created_at' | 'updated_at'
>;
