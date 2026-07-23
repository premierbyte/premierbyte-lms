export interface User {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  status: string;
  email_verified_at?: string;
  last_login_at?: string;
  roles: string[];
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}
