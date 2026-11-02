"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "../services/orders.service";
import {
  CancelOrderPayload,
  CheckoutPreviewPayload,
  CreateOrderPayload,
  ValidateCouponPayload,
} from "@/types/orders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";

export function useOrders(params: { status?: string; page?: number } = {}) {
  return useQuery({
    queryKey: ["orders", "list", params],
    queryFn: () => ordersService.getOrders(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useOrderDetail(orderNumber: string) {
  return useQuery({
    queryKey: ["orders", "detail", orderNumber],
    queryFn: () => ordersService.getOrderDetail(orderNumber),
    enabled: !!orderNumber,
  });
}

export function useOrderTracking(orderNumber: string) {
  return useQuery({
    queryKey: ["orders", "tracking", orderNumber],
    queryFn: () => ordersService.getOrderTracking(orderNumber),
    enabled: !!orderNumber,
  });
}

export function useOrderInvoice(orderNumber: string) {
  return useQuery({
    queryKey: ["orders", "invoice", orderNumber],
    queryFn: () => ordersService.getOrderInvoice(orderNumber),
    enabled: !!orderNumber,
  });
}

export function useCheckout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { fetchCart } = useCartStore();

  const previewMutation = useMutation({
    mutationFn: (payload: CheckoutPreviewPayload) =>
      ordersService.getCheckoutPreview(payload),
  });

  const validateCouponMutation = useMutation({
    mutationFn: (payload: ValidateCouponPayload) =>
      ordersService.validateCoupon(payload),
  });

  const createOrderMutation = useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      ordersService.createOrder(payload),
    onSuccess: async (order) => {
      toast.success("Buyurtma muvaffaqiyatli rasmiylashtirildi!");
      await fetchCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      // If online payment (PAYME/CLICK/UZUM), redirect to payment init
      if (order.payment_method !== "CASH_ON_DELIVERY") {
        router.push(`/checkout/payment?order=${order.order_number}`);
      } else {
        router.push(`/checkout/success?order=${order.order_number}`);
      }
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Buyurtma yaratishda xatolik yuz berdi.";
      toast.error(msg);
    },
  });

  return {
    getPreview: previewMutation.mutateAsync,
    previewData: previewMutation.data,
    isPreviewLoading: previewMutation.isPending,
    validateCoupon: validateCouponMutation.mutateAsync,
    isValidatingCoupon: validateCouponMutation.isPending,
    createOrder: createOrderMutation.mutate,
    isCreatingOrder: createOrderMutation.isPending,
  };
}
