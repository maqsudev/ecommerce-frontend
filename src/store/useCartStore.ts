import { create } from "zustand";
import { Cart, CartItem } from "@/types/cart";
import apiClient from "@/lib/api-client";

interface CartState {
  cart: Cart | null;
  itemCount: number;
  isDrawerOpen: boolean;
  isLoading: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  setCart: (cart: Cart | null) => void;
  setItemCount: (count: number) => void;
  fetchCart: () => Promise<void>;
  fetchCartCount: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  itemCount: 0,
  isDrawerOpen: false,
  isLoading: false,

  setIsDrawerOpen: (open: boolean) => set({ isDrawerOpen: open }),

  setCart: (cart: Cart | null) => {
    const totalCount =
      cart?.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) ??
      cart?.total_items ??
      0;
    set({ cart, itemCount: totalCount });
  },

  setItemCount: (itemCount: number) => set({ itemCount }),

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const response = await apiClient.get<Cart>("/api/v1/cart/");
      const cartData = response.data;
      const count =
        cartData?.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) ??
        cartData?.total_items ??
        0;
      set({ cart: cartData, itemCount: count, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchCartCount: async () => {
    try {
      const response = await apiClient.get<{ count: number }>("/api/v1/cart/count/");
      set({ itemCount: response.data.count });
    } catch {
      // Ignore count fetch errors gracefully
    }
  },
}));
