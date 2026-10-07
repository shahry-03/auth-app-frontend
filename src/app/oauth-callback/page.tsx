"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { tokenStore } from "@/lib/auth/token-store";
import { Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    const initializeAuth = async () => {
      try {
        // We hit the refresh endpoint because the backend sets the refresh_token 
        // as an HttpOnly cookie during OAuth success, but not the access_token.
        const response = await apiClient.post("/auth/refresh");
        const accessToken = response.data?.data?.accessToken;

        if (accessToken) {
          // Save for client-side API calls in memory
          tokenStore.set(accessToken);
          
          // Fetch user details to populate localStorage (optional but good practice)
          try {
            const userRes = await apiClient.get("/users/me", {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (userRes.data?.data) {
              localStorage.setItem("user", JSON.stringify(userRes.data.data));
            }
          } catch (e) {
            console.error("Failed to fetch user details", e);
          }

          // Now safely redirect to the dashboard
          router.push("/dashboard");
          router.refresh();
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to complete OAuth login", error);
        router.push("/login");
      }
    };

    initializeAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Completing sign in...
        </p>
      </div>
    </div>
  );
}
