import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { tokenStore } from "./auth/token-store";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ============================================================
//  Request interceptor — JWT auto-attach & FormData handling
// ============================================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 🔥 Remove default Content-Type for FormData to allow browser to generate boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    if (typeof window !== "undefined") {
      const token = tokenStore.get();
      // Guard against corrupt tokens
      if (
        token &&
        token !== "undefined" &&
        token !== "null" &&
        token.length > 20
      ) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (token) {
        // Clean up corrupt token
        tokenStore.clear();
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ============================================================
//  Response interceptor — auto refresh on 401
// ============================================================
interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Backend response wrapper
interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  };
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    // Do not attempt to refresh token if the 401 came from a login/2FA endpoint
    // where 401 typically means "Invalid Code" or "Invalid Password" rather than "Expired JWT"
    const isAuthEndpoint = originalRequest?.url && (
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/2fa/enable') ||
      originalRequest.url.includes('/auth/2fa/disable') ||
      originalRequest.url.includes('/auth/2fa/verify') ||
      originalRequest.url.includes('/auth/refresh')
    );

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post<RefreshResponse>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = response.data?.data?.accessToken;

        if (!newToken || newToken === "undefined") {
          throw new Error("Refresh returned no valid token");
        }

        if (typeof window !== "undefined") {
          tokenStore.set(newToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          tokenStore.clear();
          localStorage.removeItem("user");
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);
