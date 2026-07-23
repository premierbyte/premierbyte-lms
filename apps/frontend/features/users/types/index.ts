export interface User {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  username: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  bio?: string | null;
  status: 'active' | 'pending' | 'suspended';
  email_verified_at?: string | null;
  last_login_at?: string | null;
  roles: string[];
  permissions: string[];
}

export interface UserFilters {
  search?: string;
  role?: string;
  page?: number;
  per_page?: number;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password?: string;
  phone?: string | null;
  avatar?: string | null;
  bio?: string | null;
  status: 'active' | 'pending' | 'suspended';
  roles: string[];
}

export interface InviteUserData {
  email: string;
  role: string;
}
