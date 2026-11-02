export type PaymentProvider = "PAYME" | "CLICK" | "UZUM" | "CARD";
export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export interface Payment {
  id: number;
  payment_number: string;
  order_number: string;
  amount: string | number;
  provider: PaymentProvider;
  status: PaymentStatus;
  payment_url?: string | null;
  transaction_id?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface InitializePaymentPayload {
  order_number: string;
  provider: PaymentProvider;
  return_url?: string;
}

export interface InitializePaymentResponse {
  payment_number: string;
  provider: PaymentProvider;
  payment_url?: string;
  status: PaymentStatus;
}

export interface SavedCard {
  id: number;
  card_number: string; // e.g. "8600 **** **** 1234"
  expire_date: string; // e.g. "12/28"
  card_holder?: string;
  card_type?: string; // "UZCARD" | "HUMO" | "VISA" | "MASTERCARD"
  is_default: boolean;
  created_at?: string;
}

export interface AddCardPayload {
  card_number: string;
  expire_date: string;
}

export interface AddCardResponse {
  card_id: number;
  otp_sent: boolean;
  phone_hint?: string;
}

export interface VerifyCardOTPPayload {
  otp_code: string;
}

export interface PayWithCardPayload {
  card_id: number;
  order_number: string;
}

export interface AdminRefundPayload {
  amount?: string | number;
  reason: string;
}

export interface PaymentAuditLog {
  id: number;
  payment_number: string;
  action: string;
  performed_by: string;
  details?: Record<string, any>;
  timestamp: string;
}
