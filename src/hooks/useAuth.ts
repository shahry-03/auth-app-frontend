import { useState, useEffect, useRef } from "react";
import { apiClient } from "@/lib/api-client";
import { tokenStore } from "@/lib/auth/token-store";

export interface BackendUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  enabled: boolean;
  createdAt: string;
  provider: string;
  roles: { roleName: string; permissions: { name: string }[] }[];
}

// Global cache to avoid double fetching across multiple components mounting simultaneously
let globalUserCache: BackendUser | null = null;
let globalIsLoading = true;
let fetchPromise: Promise<BackendUser | null> | null = null;

export function useAuth() {
  const [user, setUser] = useState<BackendUser | null>(globalUserCache);
  const [isLoading, setIsLoading] = useState<boolean>(globalIsLoading);
  const hasAttempted = useRef(false);

  useEffect(() => {
    // If we already have a user globally, or we already attempted in this instance, skip.
    if (globalUserCache) {
      setIsLoading(false);
      return;
    }

    if (hasAttempted.current) return;
    hasAttempted.current = true;

    async function fetchUser() {
      if (fetchPromise) {
        const u = await fetchPromise;
        setUser(u);
        setIsLoading(false);
        return;
      }

      fetchPromise = (async () => {
        try {
          // If we don't have an access token in memory, try to refresh first!
          if (!tokenStore.get()) {
            const refreshRes = await apiClient.post("/auth/refresh", {});
            const newToken = refreshRes.data?.data?.accessToken;
            if (newToken) {
              tokenStore.set(newToken);
            } else {
              throw new Error("No token from refresh");
            }
          }

          const res = await apiClient.get("/users/me");
          const u = res.data?.data as BackendUser;
          globalUserCache = u;
          globalIsLoading = false;
          return u;
        } catch (error) {
          globalUserCache = null;
          globalIsLoading = false;
          tokenStore.clear();
          return null;
        }
      })();

      const u = await fetchPromise;
      setUser(u);
      setIsLoading(false);
      fetchPromise = null;
    }

    fetchUser();
  }, []);

  return { user, isLoading };
}

export function clearAuthCache() {
  globalUserCache = null;
  globalIsLoading = true;
  fetchPromise = null;
}
