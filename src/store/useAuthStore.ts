import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, AuthTokens } from "@/types/auth";
import { STORAGE_KEYS } from "@/lib/constants";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tokens: AuthTokens) => void;
  setTokens: (tokens: Partial<AuthTokens>) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user: User, tokens: AuthTokens) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh);
        }
        set({
          user,
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
          isAuthenticated: true,
        });
      },

      setTokens: (tokens: Partial<AuthTokens>) => {
        const currentRefresh = get().refreshToken;
        const newAccess = tokens.access ?? get().accessToken;
        const newRefresh = tokens.refresh ?? currentRefresh;

        if (typeof window !== "undefined") {
          if (newAccess) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccess);
          if (newRefresh) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefresh);
        }

        set({
          accessToken: newAccess,
          refreshToken: newRefresh,
          isAuthenticated: !!newAccess,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        }
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "ecommerce_auth_state",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
