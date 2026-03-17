interface User {
  fullname: string;
  avatar: string;
  email_verified_at: string;
  phone_verified_at: string | null;
  created_at: string;
  id: number;
  username: string;
  email: string;
  phone: string;
  ban_statut: boolean;
  kyc: string;
  account_type: number;
  fcm_token: string | null;
}

interface PaymentMethod {
  id: number;
  tag: string;
  label: string;
}

interface PaymentProvider {
  id: number;
  tag: string;
  label: string;
}

interface TransactionType {
  id: number;
  tag: string;
  label: string;
}

interface WithdrawTransaction {
  created_at: string;
  id: number;
  amount: number;
  type_id: number;
  tax: number;
  motif: string;
  from_user_id: number;
  from_balance: number;
  to_user_id: number;
  to_balance: number;
  proofs: any;
  admin_motif: string | null;
  external_trx_id: string;
  payment_status: boolean;
  is_cancelled: boolean;
  payment_method_id: number;
  payment_provider_id: number;
  transactionType: TransactionType;
  fromUser: User;
  toUser: User;
  paymentMethod: PaymentMethod;
  paymentProvider: PaymentProvider;
}

interface WithdrawPaymentMethod {
  tag: string;
  label: string;
}

export interface WithdrawDetailTypes {
  receiver_detail: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  id: number;
  payment_method_id: number;
  transaction_id: number;
  user_id: number;
  track_number: string;
  completed_by: number | null;
  completed_at: string | null;
  withdraw_paymentMethod: WithdrawPaymentMethod;
  withdraw_transaction: WithdrawTransaction;
  withdraw_completed_by: any;
  company ?: {
    name: string;
    logo: string;
  };
}
