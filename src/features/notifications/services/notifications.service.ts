import apiClient from "@/lib/api-client";
import {
  Notification,
  NotificationPreferences,
  UnreadCountResponse,
} from "@/types/notifications";
import { PaginatedResponse } from "@/types/common";

export const notificationsService = {
  async getNotifications(
    params: { is_read?: boolean; type?: string } = {}
  ): Promise<Notification[]> {
    const response = await apiClient.get<Notification[] | PaginatedResponse<Notification>>(
      "/api/v1/notifications/",
      { params }
    );
    return Array.isArray(response.data)
      ? response.data
      : (response.data as PaginatedResponse<Notification>).results || [];
  },

  async getUnreadCount(): Promise<UnreadCountResponse> {
    const response = await apiClient.get<UnreadCountResponse>(
      "/api/v1/notifications/unread-count/"
    );
    return response.data;
  },

  async markAsRead(id: number | string): Promise<void> {
    await apiClient.post(`/api/v1/notifications/${id}/read/`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.post("/api/v1/notifications/read-all/");
  },

  async deleteNotification(id: number | string): Promise<void> {
    await apiClient.delete(`/api/v1/notifications/${id}/`);
  },

  async getPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.get<NotificationPreferences>(
      "/api/v1/notifications/preferences/"
    );
    return response.data;
  },

  async updatePreferences(
    payload: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const response = await apiClient.patch<NotificationPreferences>(
      "/api/v1/notifications/preferences/",
      payload
    );
    return response.data;
  },
};
