"use server";

import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "@/app/actions/auth";
import { TokenResponse } from "@/types";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { requireAuth = true, ...customConfig } = options;

  let accessToken = requireAuth ? await getAccessToken() : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customConfig.headers as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers,
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Token refresh logic
  if (response.status === 401 && requireAuth) {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const tokens: TokenResponse = await refreshRes.json();
          await setTokens(tokens);
          
          // Retry original request with new token
          headers["Authorization"] = `Bearer ${tokens.accessToken}`;
          response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...customConfig,
            headers,
          });
        } else {
          await clearTokens();
          redirect("/login");
        }
      } catch (error) {
        await clearTokens();
        redirect("/login");
      }
    } else {
      await clearTokens();
      redirect("/login");
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || response.statusText || "An error occurred");
  }

  // Handle empty responses
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
}
