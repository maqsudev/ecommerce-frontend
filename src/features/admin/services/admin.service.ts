import apiClient from "@/lib/api-client";
import {
  AdjustStockPayload,
  CustomerDossier,
  ExecutiveKPIs,
  InventoryStockItem,
  SalesChartDataPoint,
  TopCustomerItem,
  TopProductItem,
} from "@/types/dashboard";
import { Order, UpdateOrderStatusPayload } from "@/types/orders";
import { Review, ModerateReviewPayload } from "@/types/reviews";
import { PaginatedResponse } from "@/types/common";

export const adminService = {
  async getOverviewKPIs(params?: { date_from?: string; date_to?: string }): Promise<ExecutiveKPIs> {
    const response = await apiClient.get<ExecutiveKPIs>(
      "/api/v1/dashboard/analytics/overview/",
      { params }
    );
    return response.data;
  },

  async getSalesChart(days: number = 30): Promise<SalesChartDataPoint[]> {
    const response = await apiClient.get<SalesChartDataPoint[]>(
      "/api/v1/dashboard/analytics/sales-chart/",
      { params: { days } }
    );
    return response.data;
  },

  async getTopProducts(limit: number = 10): Promise<TopProductItem[]> {
    const response = await apiClient.get<TopProductItem[]>(
      "/api/v1/dashboard/analytics/top-products/",
      { params: { limit } }
    );
    return response.data;
  },

  async getTopCustomers(limit: number = 10): Promise<TopCustomerItem[]> {
    const response = await apiClient.get<TopCustomerItem[]>(
      "/api/v1/dashboard/analytics/top-customers/",
      { params: { limit } }
    );
    return response.data;
  },

  async getInventoryStocks(): Promise<InventoryStockItem[]> {
    const response = await apiClient.get<InventoryStockItem[] | PaginatedResponse<InventoryStockItem>>(
      "/api/v1/dashboard/inventory/"
    );
    return Array.isArray(response.data)
      ? response.data
      : (response.data as PaginatedResponse<InventoryStockItem>).results || [];
  },

  async adjustStock(variantId: number, payload: AdjustStockPayload): Promise<InventoryStockItem> {
    const response = await apiClient.patch<InventoryStockItem>(
      `/api/v1/dashboard/inventory/${variantId}/adjust/`,
      payload
    );
    return response.data;
  },

  async getAdminOrders(status?: string): Promise<Order[]> {
    const response = await apiClient.get<Order[] | PaginatedResponse<Order>>(
      "/api/v1/dashboard/orders/",
      { params: status ? { status } : undefined }
    );
    return Array.isArray(response.data)
      ? response.data
      : (response.data as PaginatedResponse<Order>).results || [];
  },

  async updateOrderStatus(
    orderNumber: string,
    payload: UpdateOrderStatusPayload
  ): Promise<Order> {
    const response = await apiClient.patch<Order>(
      `/api/v1/dashboard/orders/${orderNumber}/status/`,
      payload
    );
    return response.data;
  },

  async addOrderNote(orderNumber: string, adminNotes: string): Promise<any> {
    const response = await apiClient.post(
      `/api/v1/dashboard/orders/${orderNumber}/notes/`,
      { admin_notes: adminNotes }
    );
    return response.data;
  },

  async getAdminCustomers(): Promise<CustomerDossier[]> {
    const response = await apiClient.get<CustomerDossier[] | PaginatedResponse<CustomerDossier>>(
      "/api/v1/dashboard/customers/"
    );
    return Array.isArray(response.data)
      ? response.data
      : (response.data as PaginatedResponse<CustomerDossier>).results || [];
  },

  async toggleCustomerStatus(customerId: number): Promise<{ is_active: boolean }> {
    const response = await apiClient.patch<{ is_active: boolean }>(
      `/api/v1/dashboard/customers/${customerId}/toggle-status/`
    );
    return response.data;
  },

  async getPendingReviews(): Promise<Review[]> {
    const response = await apiClient.get<Review[] | PaginatedResponse<Review>>(
      "/api/v1/reviews/admin/moderation/",
      { params: { status: "PENDING" } }
    );
    return Array.isArray(response.data)
      ? response.data
      : (response.data as PaginatedResponse<Review>).results || [];
  },

  async moderateReview(
    reviewId: number,
    payload: ModerateReviewPayload
  ): Promise<{ status: string }> {
    const response = await apiClient.post<{ status: string }>(
      `/api/v1/reviews/admin/${reviewId}/moderate/`,
      payload
    );
    return response.data;
  },
};
