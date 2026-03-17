import { AdsSuperCategoryModelType } from '@/types/AdsSuperCategoryModelType.ts'

export interface AdsCategoryModelTypes {
  id?: number
  tag?: string
  label?: string
  visibility?: boolean
  description?: string
  icon?: string
  super_ads_category_id?: number
  superCategory?: AdsSuperCategoryModelType
  super_category_tag?: string
  created_at?: string
  updated_at?: string
}

