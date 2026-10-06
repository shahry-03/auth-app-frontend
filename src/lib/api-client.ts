import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ============================================================
//  Request interceptor — JWT auto-attach
// ============================================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
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
        localStorage.removeItem("accessToken");
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

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post<RefreshResponse>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // ✅ FIX: Proper nested path — response.data.data.accessToken
        const newToken = response.data?.data?.accessToken;

        if (!newToken || newToken === "undefined") {
          throw new Error("Refresh returned no valid token");
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", newToken);
        }

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);