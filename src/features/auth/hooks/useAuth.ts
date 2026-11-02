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
    if (data.access) {
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
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Kirish ma'lumotlari noto'g'ri!";
      toast.error(msg);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      handleAuthSuccess(data, "Akkauntingiz muvaffaqiyatli yaratildi!");
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Ro'yxatdan o'tishda xatolik yuz berdi.";
      toast.error(msg);
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: (payload: SendOTPPayload) => authService.sendOtp(payload),
    onSuccess: () => {
      toast.success("Tasdiqlash kodi emailingizga yuborildi!");
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Kodni yuborishda xatolik yuz berdi.";
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
