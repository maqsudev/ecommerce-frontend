import apiClient from "@/lib/api-client";
import {
  CancelOrderPayload,
  CheckoutPreviewPayload,
  CheckoutPreviewResponse,
  CreateOrderPayload,
  Invoice,
  Order,
  OrderTrackingResponse,
  ValidateCouponPayload,
  ValidateCouponResponse,
} from "@/types/orders";
import { PaginatedResponse } from "@/types/common";

export const ordersService = {
  async getCheckoutPreview(
    payload: CheckoutPreviewPayload
  ): Promise<CheckoutPreviewResponse> {
    const response = await apiClient.post<CheckoutPreviewResponse>(
      "/api/v1/orders/checkout/preview/",
      payload
    );
    return response.data;
  },

  async validateCoupon(
    payload: ValidateCouponPayload
  ): Promise<ValidateCouponResponse> {
    const response = await apiClient.post<ValidateCouponResponse>(
      "/api/v1/orders/coupons/validate/",
      payload
    );
    return response.data;
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const response = await apiClient.post<Order>("/api/v1/orders/", payload);
    return response.data;
  },

  async getOrders(
    params: { status?: string; page?: number } = {}
  ): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get<PaginatedResponse<Order>>(
      "/api/v1/orders/",
      { params }
    );
    return response.data;
  },

  async getOrderDetail(orderNumber: string): Promise<Order> {
    const response = await apiClient.get<Order>(
      `/api/v1/orders/${orderNumber}/`
    );
    return response.data;
  },

  async cancelOrder(
    orderNumber: string,
    payload: CancelOrderPayload
  ): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `/api/v1/orders/${orderNumber}/cancel/`,
      payload
    );
    return response.data;
  },

  async getOrderTracking(orderNumber: string): Promise<OrderTrackingResponse> {
    const response = await apiClient.get<OrderTrackingResponse>(
      `/api/v1/orders/${orderNumber}/tracking/`
    );
    return response.data;
  },

  async getOrderInvoice(orderNumber: string): Promise<Invoice> {
    const response = await apiClient.get<Invoice>(
      `/api/v1/orders/${orderNumber}/invoice/`
    );
    return response.data;
  },
};
