import { ProductConditionsType } from "@/types/ProductConditionsType"

class ProductConditionsHelpers {
  static list: ProductConditionsType[] = [
    { id: 1, label: 'À réparer' },
    { id: 2, label: 'Occasion' },
    { id: 3, label: 'Reconditionné / Très bon état' },
    { id: 4, label: 'Neuf' },
    { id: 5, label: 'Neuf scellé' }
  ]
}

export { ProductConditionsHelpers }
