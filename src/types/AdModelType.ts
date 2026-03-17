
export interface AdModelType {
   id?: number;
   name?: string;
   description?: string;
   ad_type?: 'rent' | 'sale';
   price_type?: 'houly'|'fixed' | 'daily' | 'monthly';
   production_condition: '1'| '2' | '3' | '4' | '5';
   quantity?: number;
   price?: number;
   images?: object;
   image?: string;
   videos?: string;
   is_negotiable?: boolean|false;
   is_available?: boolean|false;
   super_category_id?: number;
   category_id?: number;
   company_id?: number;
   verified_by?: number;
   slug ?: string;
   city_id?: number;
   department_id ?: number;
   country_id ?: number;
   address ?: string|null;
   longitude ?: string;
   latitude ?: string;
   verified_at?: Date | null;
   created_at?: Date | string;
   updated_at?: Date | string;
   deleted_at?: Date | string | null;
}