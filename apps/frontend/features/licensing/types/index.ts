export interface LicenseStatus {
  valid: boolean;
  status: string;
  expires_at?: string | null;
  plan?: Record<string, any> | null;
  features: Record<string, boolean>;
  in_restricted_mode: boolean;
  message?: string | null;
}
