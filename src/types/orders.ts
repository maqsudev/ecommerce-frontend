import { ProductVariant } from "./catalog";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentMethod =
  | "CASH_ON_DELIVERY"
  | "PAYME"
  | "CLICK"
  | "UZUM"
  | "SAVED_CARD";

export type ShippingMethod = "STANDARD" | "EXPRESS" | "PICKUP";

export interface ShippingAddress {
  recipient_name: string;
  phone_number: string;
  alternative_phone_number?: string;
  region: string;
  district: string;
  street_address: string;
  apartment_office?: string;
  postal_code?: string;
  landmark?: string;
  delivery_instructions?: string;
}

export interface OrderItem {
  id: number;
  variant_id: number;
  product_name: string;
  variant_name?: string;
  sku: string;
  unit_price: string | number;
  quantity: number;
  total_price: string | number;
  variant?: ProductVariant;
  image?: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: string;
  shipping_method: ShippingMethod;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  subtotal: string | number;
  shipping_fee: string | number;
  discount_amount: string | number;
  total_amount: string | number;
  coupon_code?: string | null;
  customer_notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CheckoutPreviewPayload {
  shipping_method: ShippingMethod;
  coupon_code?: string;
  region?: string;
}

export interface CheckoutPreviewResponse {
  subtotal: string | number;
  shipping_fee: string | number;
  discount: string | number;
  estimated_tax?: string | number;
  grand_total: string | number;
  estimated_delivery_days?: number;
  coupon_applied?: boolean;
}

export interface ValidateCouponPayload {
  code: string;
  subtotal: string | number;
}

export interface ValidateCouponResponse {
  valid: boolean;
  discount_amount: string | number;
  discount_percent?: number;
  message: string;
}

export interface CreateOrderPayload {
  shipping_address: ShippingAddress;
  shipping_method: ShippingMethod;
  payment_method: PaymentMethod;
  coupon_code?: string;
  customer_notes?: string;
}

export interface CancelOrderPayload {
  reason: string;
}

export interface TrackingMilestone {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface OrderTrackingResponse {
  order_number: string;
  status: OrderStatus;
  tracking_number?: string | null;
  carrier?: string | null;
  milestones: TrackingMilestone[];
}

export interface InvoiceCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface Invoice {
  invoice_number: string;
  issue_date: string;
  due_date: string;
  order_number: string;
  customer: InvoiceCustomer;
  billing_address: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface UpdateOrderStatusPayload {
  new_status: OrderStatus;
  comment?: string;
  tracking_number?: string;
  is_customer_visible?: boolean;
}

export interface AddOrderNotePayload {
  admin_notes: string;
}
