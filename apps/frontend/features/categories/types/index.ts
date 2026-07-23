export interface Category {
  id: number;
  parent_id?: number | null;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  status: 'active' | 'inactive';
  sort_order: number;
  parent?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  children?: Category[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  parent_id?: number | null;
  description?: string | null;
  image?: string | null;
  status: 'active' | 'inactive';
  sort_order?: number;
}

export interface ReorderCategoryItem {
  id: number;
  sort_order: number;
}
