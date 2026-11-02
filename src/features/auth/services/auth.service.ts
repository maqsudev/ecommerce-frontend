import apiClient from "@/lib/api-client";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  SendOTPPayload,
  User,
  VerifyOTPPayload,
} from "@/types/auth";
import { MergeCartPayload, MergeCartResponse } from "@/types/cart";
import { STORAGE_KEYS } from "@/lib/constants";

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/register/",
      payload
    );
    return response.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/login/",
      payload
    );
    return response.data;
  },

  async sendOtp(payload: SendOTPPayload): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      "/api/v1/auth/send-otp/",
      payload
    );
    return response.data;
  },

  async verifyOtp(payload: VerifyOTPPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/api/v1/auth/verify-otp/",
      payload
    );
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>("/api/v1/auth/me/");
    return response.data;
  },

  /**
   * Automatically merges the guest's cart into the user's account upon login
   */
  async mergeGuestCart(): Promise<MergeCartResponse | null> {
    if (typeof window === "undefined") return null;
    const guestKey = localStorage.getItem(STORAGE_KEYS.GUEST_SESSION);
    if (!guestKey) return null;

    try {
      const response = await apiClient.post<MergeCartResponse>(
        "/api/v1/cart/merge/",
        {
          guest_session_key: guestKey,
          guest_cart_id: null,
        } as MergeCartPayload
      );
      return response.data;
    } catch {
      // Non-blocking merge error
      return null;
    }
  },
};
