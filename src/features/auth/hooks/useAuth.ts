"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  SendOTPPayload,
  VerifyOTPPayload,
} from "@/types/auth";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setAuth, setUser, logout: clearAuthStore } =
    useAuthStore();
  const { fetchCart } = useCartStore();

  const handleAuthSuccess = async (data: AuthResponse, successMessage: string) => {
    // If the backend returns access & refresh tokens directly
    if (data.access && data.refresh && data.user) {
      setAuth(data.user, {
        access: data.access,
        refresh: data.refresh,
      });

      // Merge guest cart into user account
      await authService.mergeGuestCart();
      await fetchCart();

      toast.success(successMessage);
      router.push("/");
    }
  };

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      handleAuthSuccess(data, "Tizimga muvaffaqiyatli kirdingiz!");
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      let msg = "Kirish ma'lumotlari noto'g'ri!";
      if (typeof errorData === "string") {
        msg = errorData;
      } else if (errorData && typeof errorData === "object") {
        if (errorData.detail) {
          msg = errorData.detail;
        } else if (errorData.message) {
          msg = errorData.message;
        } else if (errorData.non_field_errors) {
          msg = Array.isArray(errorData.non_field_errors)
            ? errorData.non_field_errors.join(", ")
            : errorData.non_field_errors;
        }
      }
      toast.error(msg);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data: AuthResponse, variables: RegisterPayload) => {
      if (data?.access && data?.user) {
        handleAuthSuccess(data, "Akkauntingiz muvaffaqiyatli yaratildi!");
      } else {
        const targetEmail = data?.email || variables?.email;
        if (data?.otp_code) {
          toast.success(
            `Tasdiqlash kodi: ${data.otp_code} (ishlab chiqish rejimi)`,
            { duration: 8000 }
          );
        } else {
          toast.success(
            data?.message || "Akkaunt yaratildi! Emailingizga tasdiqlash kodi yuborildi."
          );
        }
        if (targetEmail) {
          router.push(`/verify-otp?email=${encodeURIComponent(targetEmail)}`);
        } else {
          router.push("/login");
        }
      }
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      let msg = "Ro'yxatdan o'tishda xatolik yuz berdi.";
      if (typeof errorData === "string") {
        msg = errorData;
      } else if (errorData && typeof errorData === "object") {
        if (errorData.detail) {
          msg = errorData.detail;
        } else if (errorData.message) {
          msg = errorData.message;
        } else {
          const messages: string[] = [];
          for (const [key, val] of Object.entries(errorData)) {
            if (Array.isArray(val)) {
              messages.push(`${key}: ${val.join(", ")}`);
            } else if (typeof val === "string") {
              messages.push(`${key}: ${val}`);
            }
          }
          if (messages.length > 0) {
            msg = messages.join(" | ");
          }
        }
      }
      toast.error(msg);
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: (payload: SendOTPPayload) => authService.sendOtp(payload),
    onSuccess: (data: any) => {
      if (data?.otp_code) {
        toast.success(
          `Yangi tasdiqlash kodi: ${data.otp_code} (ishlab chiqish rejimi)`,
          { duration: 8000 }
        );
      } else {
        toast.success(data?.message || "Tasdiqlash kodi emailingizga yuborildi!");
      }
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      let msg = "Kodni yuborishda xatolik yuz berdi.";
      if (typeof errorData === "string") {
        msg = errorData;
      } else if (errorData && typeof errorData === "object") {
        if (errorData.detail) {
          msg = errorData.detail;
        } else if (errorData.message) {
          msg = errorData.message;
        } else if (errorData.email) {
          msg = Array.isArray(errorData.email) ? errorData.email.join(", ") : errorData.email;
        }
      }
      toast.error(msg);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (payload: VerifyOTPPayload) => authService.verifyOtp(payload),
    onSuccess: (data) => {
      handleAuthSuccess(data, "Email muvaffaqiyatli tasdiqlandi!");
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Kiritilgan kod noto'g'ri yoki eskirgan.";
      toast.error(msg);
    },
  });

  const {
    data: currentUser,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const me = await authService.getMe();
      setUser(me);
      return me;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const logout = () => {
    clearAuthStore();
    queryClient.clear();
    toast.info("Tizimdan chiqdingiz.");
    router.push("/login");
  };

  return {
    user: currentUser || user,
    isAuthenticated,
    isUserLoading,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    sendOtp: sendOtpMutation.mutate,
    isSendingOtp: sendOtpMutation.isPending,
    verifyOtp: verifyOtpMutation.mutate,
    isVerifyingOtp: verifyOtpMutation.isPending,
    refetchUser,
    logout,
  };
}
