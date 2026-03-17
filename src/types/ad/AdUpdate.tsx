import { company } from '@/types/ad/AdProps.ts'
import { AdModelType } from '../AdModelType';



interface Category {
  icon: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  id: number;
  tag: string;
  label: string;
  visibility: boolean;
  description: string;
  super_ads_category_id: number;
  superCategory: SuperCategory;
}

interface SuperCategory {
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  id: number;
  tag: string;
  label: string;
}

interface Localisation {
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  tag: string;
  label: string;
  department_id: number;
  department: Department;
}

interface Department {
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  tag: string;
  label: string;
  country_id: number;
  country: Country;
}


interface Country {
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  tag: string;
  label: string;
  lang: string;
}


interface AdUpdateContent {
  name: string;
  description: string;
  ad_type: "rent" | "sale";
  price_type: "monthly" | "weekly" | "daily";
  quantity: string;
  price: string;
  images: string[];
  videos: string;
  is_negotiable: string;
  super_category_id: number;
  production_condition: string;
  category_id: string;
  address: string;
  longitude ?: number;
  latitude ?: number;
  department_id ?: number;
  country_id ?: number;
  google_map_url_company?: string;
  data_features: {
    land_area: string;
    number_of_rooms: string;
    minimum_stay_duration: string;
    has_security_guard: boolean;
    has_surveillance_camera: boolean;
    electricity_type: string;
    meter_type: string;
    number_of_living_rooms: string;
    water_type: string;
    rental_deposit: string;
    has_garden: boolean;
    has_private_entry: boolean;
    number_of_bathrooms: string;
    has_private_terrace: boolean;
    has_swimming_pool: boolean;
    has_parking_or_garage: boolean;
    cooling_type: string;
    max_occupancy: string;
    has_washing_machine: boolean;
    has_kitchen: boolean;
    has_wifi: boolean;
    has_dryer: boolean;
    children_allowed: boolean;
    events_allowed: boolean;
    smoking_policy: string;
  };
}

interface AdUpdate {
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  id: number;
  slug:string;
  ad_id: number | null;
  update_content: AdUpdateContent;
  created_by: number;
  adsAdsSubmitCompany:company;
  category: Category;
  localisation: Localisation;
  originalAd: AdModelType;
  statut: boolean;
  verified_by: number | null;
  verifier_reason: string | null;
  verified_at: string | null;
}


export default AdUpdate;

