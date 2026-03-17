export interface DashboardStatsType {
  totalUsers: number
  totalSalesAmount: number
  withdrawals: number
  balance: number
  chartSaleData: ChartSaleDataType[]
  latestUsers: UserType[]
  lastOrders: OrderType[]
}
export type ChartSaleDataType = {
  date: string // format: YYYY-MM-DD
  ventes: number
}

export interface UserType {
  id: number
  username: string
  fullname: string
  avatar: string
  email: string
  phone: string | null
  ban_statut: number
  kyc: string
  account_type: number,
  created_at: string
}

export interface OrderType {
  id: number;
  order_num: string;
  sub_total: number;
  promo_code: string | null;
  client_id: number | null;
  deliverer_id: number | null;
  promo_code_amount: number;
  delivery_price: number;
  total_paid: number;
  transaction_id: number | null;
  on_delivery_accepted: string | null;  // ISO date string
  on_confirmed: boolean;
  completed_at: string | null;          // ISO date string ou null
  reviews_at: string | null;            // ISO date string ou null
  client_rejected_at: string | null;    // ISO date string ou null
  client_rejected_reason: string | null;
  created_at: string;                    // ISO date string
  updated_at: string;                    // ISO date string
  deleted_at: string | null;            // ISO date string ou null
  order_more_detail_client: UserType | null;
  order_more_detail_deliverer: UserType | null;
}

