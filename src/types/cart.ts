import { ProductVariant, Product } from "./catalog";

export interface CartItem {
  id: number;
  variant_id: number;
  variant: ProductVariant;
  product?: Product;
  quantity: number;
  unit_price: string | number;
  total_price: string | number;
}

export interface Cart {
  id: number | string;
  session_key?: string | null;
  user_id?: number | null;
  items: CartItem[];
  total_items: number;
  subtotal: string | number;
  discount: string | number;
  total: string | number;
  coupon?: string | null;
}

export interface CartCountResponse {
  count: number;
}

export interface AddToCartPayload {
  variant_id: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface MergeCartPayload {
  guest_session_key: string;
  guest_cart_id?: number | null;
}

export interface MergeCartResponse {
  merged: boolean;
  total_items: number;
  message?: string;
}
