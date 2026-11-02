import apiClient from "@/lib/api-client";
import {
  AddCardPayload,
  AddCardResponse,
  Payment,
  PayWithCardPayload,
  SavedCard,
} from "@/types/payments";
import { PaginatedResponse } from "@/types/common";

export const paymentsService = {
  async getSavedCards(): Promise<SavedCard[]> {
    const response = await apiClient.get<SavedCard[] | PaginatedResponse<SavedCard>>(
      "/api/v1/payments/cards/"
    );
    return Array.isArray(response.data)
      ? response.data
      : (response.data as PaginatedResponse<SavedCard>).results || [];
  },

  async addCard(payload: AddCardPayload): Promise<AddCardResponse> {
    const response = await apiClient.post<AddCardResponse>(
      "/api/v1/payments/cards/",
      payload
    );
    return response.data;
  },

  async verifyCardOtp(cardId: number, otpCode: string): Promise<SavedCard> {
    const response = await apiClient.post<SavedCard>(
      `/api/v1/payments/cards/${cardId}/verify/`,
      { otp_code: otpCode }
    );
    return response.data;
  },

  async setDefaultCard(cardId: number): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `/api/v1/payments/cards/${cardId}/default/`
    );
    return response.data;
  },

  async deleteCard(cardId: number): Promise<void> {
    await apiClient.delete(`/api/v1/payments/cards/${cardId}/`);
  },

  async payWithCard(
    payload: PayWithCardPayload
  ): Promise<{ success: boolean; message?: string }> {
    const response = await apiClient.post<{ success: boolean; message?: string }>(
      "/api/v1/payments/pay-with-card/",
      payload
    );
    return response.data;
  },
};
