interface DeliveryMethodType {
  id: number;
  name: string;
  tag: string;
  icon: string;
  is_active: boolean;
  price: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export default DeliveryMethodType