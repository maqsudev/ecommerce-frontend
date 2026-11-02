import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "./constants";
import { getOrCreateGuestSessionKey } from "./session";
import { useAuthStore } from "@/store/useAuthStore";
import { RefreshTokenResponse } from "@/types/auth";
import { dispatchMockResponse } from "./mock-engine";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (token) {
      promise.resolve(token);
    } else {
      promise.reject(error);
    }
  });
  failedQueue = [];
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 3500, // Responsive timeout so offline fallback triggers immediately
});

/**
 * Request Interceptor:
 * Attaches JWT Bearer token if user is logged in.
 * Injects X-Session-Key for guest sessions / cart operations.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore.getState();
    const token =
      authStore.accessToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        : null);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Always provide guest session key (especially important for guest cart / orders)
    const guestSessionKey = getOrCreateGuestSessionKey();
    if (guestSessionKey) {
      config.headers["X-Session-Key"] = guestSessionKey;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Response Interceptor:
 * 1. Handles 401 Unauthorized errors with atomic token refresh and queue locking.
 * 2. When backend is offline or endpoint 404/502/503, seamlessly serves high-fidelity mock fallback from Postman specification.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle 401 token refresh if response exists
    const isAuthRoute =
      originalRequest.url?.includes("/auth/token/refresh/") ||
      originalRequest.url?.includes("/auth/login/");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const authStore = useAuthStore.getState();
      const refreshToken =
        authStore.refreshToken ||
        (typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
          : null);

      if (!refreshToken) {
        isRefreshing = false;
        authStore.logout();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post<RefreshTokenResponse>(
          `${API_BASE_URL}/api/v1/auth/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccessToken = data.access;
        authStore.setTokens({
          access: newAccessToken,
          refresh: data.refresh || refreshToken,
        });

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Fallback engine: triggers when network fails (backend offline) or endpoint missing
    const isNetworkError =
      !error.response ||
      error.code === "ECONNABORTED" ||
      error.code === "ERR_NETWORK" ||
      error.message?.includes("Network Error");
    const isMissingBackend =
      error.response?.status === 404 ||
      error.response?.status === 502 ||
      error.response?.status === 503;

    if (isNetworkError || isMissingBackend) {
      try {
        let requestData = originalRequest.data;
        if (typeof requestData === "string") {
          try {
            requestData = JSON.parse(requestData);
          } catch {
            // Keep as string
          }
        }

        const mockResult = await dispatchMockResponse(
          originalRequest.method || "GET",
          originalRequest.url || "",
          requestData,
          originalRequest.params
        );

        return {
          data: mockResult,
          status: 200,
          statusText: "OK (Offline Spec Fallback)",
          headers: {},
          config: originalRequest,
        };
      } catch (mockError) {
        console.error("Mock dispatch fallback error:", mockError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
