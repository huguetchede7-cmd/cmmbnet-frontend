
declare module 'order-types' {
  export interface Coordinates {
    lat: number | string;
    lng: number | string;
    shopId?: number;
  }

  export interface DistanceInfo {
    coord: Coordinates;
    distance: string;
    distanceMeter: number;
  }

  export interface TraficCostDetail {
    distance: number;
    distanceKm: string;
    duration: number;
    duration_in_traffic: number;
    total_cost: number;
    map_url: string;
  }

  export interface OrderDeliveryOptionsData {
    driving: string;
    moreFarthestCompanies: {
      farthestCoord: Coordinates;
      maxDistance: string;
      allDistances: DistanceInfo[];
    };
    farthestCoord: Coordinates;
    destinationPoint: Coordinates;
    companiesPositions: Coordinates[];
    trafic_cost_detail: TraficCostDetail;
    real_trafic_cost: number;
  }

  export interface Miscellaneous {
    product_source: string;
    payment_option: string;
    orderDeliveryOptionsData: OrderDeliveryOptionsData;
  }

  export interface DeliveryMethod {
    id: number;
    tag: string;
    name: string;
    icon: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    price: number;
  }

  export interface OrderMoreDetails {
    id: number;
    order_id: number;
    client_name: string;
    client_phone: string;
    client_email: string;
    delivery_method_id: number;
    deliverer_name: string | null;
    deliverer_phone: string | null;
    delivery_distance: number;
    delivery_start_from: Coordinates;
    delivery_end_to: Coordinates;
    delivery_client_full_address: string;
    miscellaneous: Miscellaneous;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    order_more_detail_deliveryMethod: DeliveryMethod;
  }

  export interface DeliveryCompany {
    logo_path: string;
    user_id: number;
    name: string;
    google_map_url_company: string;
    address: string;
    city: string;
    country: string;
    phone_number: string;
  }

  export interface OrderDeliveryStep {
    id: number;
    order_id: number;
    rank: number;
    title: string;
    statut: number;
    deliverrer_id: number | null;
    delivery_motif: string | null;
    client_id: number;
    company_id: number | null;
    created_at: string;
    updated_at: string;
    order_delivery_company_id: DeliveryCompany | null;
  }

  export interface User {
    id: number;
    username: string;
    email: string;
    phone: string;
    fullname: string;
    avatar: string;
    email_verified_at: string;
    phone_verified_at: string | null;
    created_at: string;
    ban_statut: boolean;
    kyc: string;
    account_type: number;
    fcm_token: string | null;
  }

  export interface PaymentMethod {
    id: number;
    tag: string;
    label: string;
  }

  export interface PaymentProvider {
    id: number;
    tag: string;
    label: string;
  }

  export interface TransactionType {
    id: number;
    tag: string;
    label: string;
  }

  export interface OrderTransaction {
    id: number;
    amount: number;
    type_id: number;
    tax: number;
    motif: string;
    from_user_id: number;
    from_balance: number;
    to_user_id: number;
    to_balance: number;
    proofs: string;
    admin_motif: string;
    external_trx_id: string;
    payment_status: boolean;
    is_cancelled: boolean;
    payment_method_id: number;
    payment_provider_id: number;
    created_at: string;
    transactionType: TransactionType;
    fromUser: User;
    toUser: User;
    paymentMethod: PaymentMethod;
    paymentProvider: PaymentProvider;
  }

  export interface OrderProduct {
    id: number;
    order_id: number;
    company_id: number;
    ads_id: number;
    ads_name: string;
    sale_price: number;
    quantity: number;
    total_amount: number;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    order_product_ad: {
      images: Record<string, string>; // clé = index en string, valeur = URL
    };
    order_product_company: {
      logo_path: string;
      user_id: number;
      name: string;
      google_map_url_company: string;
      address: string;
      city: string;
      country: string;
      phone_number: string;
    };
  }

  export interface OrderClientReviews {
    id: number;
    order_id: number; 
    type: string; 
    note: string; 
    message: string; 
    created_at: string;
  }

  export interface OrderStatus {
    delivery: -1 | 0 | 1 | 2;
    payment: 0 | 1 | 2 | 3;
  }

  export interface Order {
    id: number;
    order_num: string;
    sub_total: number;
    statut: OrderStatus;
    promo_code: string | null;
    client_id: number;
    deliverer_id: number | null;
    promo_code_amount: number;
    delivery_price: number;
    total_paid: number;
    transaction_id: number;
    on_confirmed: boolean;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    on_delivery_accepted: string;
    client_rejected_at: string;
    client_rejected_reason: string;
    deleted_at: string | null;
    currentDelivery: string | null;
    order_transaction: OrderTransaction;
    order_more_details: OrderMoreDetails;
    order_delivery_steps: OrderDeliveryStep[];
    order_products: OrderProduct[];
    order_client_reviews: OrderClientReviews[]
  }

  export interface OrderShort {
    order_num: string; 
    completed_at: Date | string; 
    total_paid: string;
    created_at: string; 
    on_confirmed: string; 
    on_delivery_accepted: string;
    client_name: string;
    client_phone: string;
    client_email: string;
    deliverer_name: string;
    deliverer_phone: string;
    payment_status: string;
  }
}
