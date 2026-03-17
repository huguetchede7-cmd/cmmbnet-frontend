export interface user {
  fullname?: string
  avatar?: string
  email?: string
}
export interface company {
  name?: string;
  logo_path?: string;
  address ?: string;
  longitude ?: number;
  latitude ?: number;
  city?: string;
  country?: string;
  user?: user
}

export interface AdProps {
  ad_id?: number|null
  title?: string
  description?: string
  image?:  string
  company?: company
  super_category : number;
  created_at: string;
}

