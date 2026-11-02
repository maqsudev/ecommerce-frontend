export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "ecommerce_access_token",
  REFRESH_TOKEN: "ecommerce_refresh_token",
  USER_DATA: "ecommerce_user_data",
  GUEST_SESSION: "ecommerce_guest_session_key",
  SAVED_CART: "ecommerce_local_cart",
  THEME: "ecommerce_theme",
} as const;

export const ORDER_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RETURNED: "RETURNED",
} as const;

export const PAYMENT_METHOD = {
  CASH_ON_DELIVERY: "CASH_ON_DELIVERY",
  PAYME: "PAYME",
  CLICK: "CLICK",
  UZUM: "UZUM",
  SAVED_CARD: "SAVED_CARD",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  CANCELLED: "CANCELLED",
} as const;

export const SHIPPING_METHOD = {
  STANDARD: "STANDARD",
  EXPRESS: "EXPRESS",
  PICKUP: "PICKUP",
} as const;
