export default interface AdsCreateFields {
  name: string;
  description: string;
  ad_type: 'rent' | 'sale';
  price_type: 'houly' | 'fixed' | 'daily' | 'monthly';
  price: number;
  quantity: number;
  videos?: string | null;
  is_negotiable: boolean;
  super_category_tags?: string | null;
  category_tags?: string | null;
  images?: string[];
  company: string;
}