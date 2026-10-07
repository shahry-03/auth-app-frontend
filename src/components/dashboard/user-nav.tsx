"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { LogOut, User, Settings, Shield } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { tokenStore } from "@/lib/auth/token-store";
import { clearAuthCache } from "@/hooks/useAuth";

interface UserNavUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface UserNavProps {
  user: UserNavUser;
}

export function UserNav({ user: serverUser }: UserNavProps) {
  const router = useRouter();
  
  // Prefer client-side store user if available (e.g. immediately after profile update)
  const storeUser = useAuthStore((state) => state.user) as UserNavUser | null;
  // Use storeUser ONLY if it matches the server user's ID/email to prevent stale cross-user state
  const isSameUser = storeUser && serverUser && (storeUser.id === serverUser.id || storeUser.email === serverUser.email);
  const user = isSameUser ? storeUser : serverUser;

  const handleLogout = async () => {
    // 1. Call backend logout (invalidates refresh token on server)
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Ignore — even if API fails, we still clear local state
    }

    // 2. Clear client-side storage
    clearAuthCache();
    tokenStore.clear();
    localStorage.removeItem("user");
    useAuthStore.getState().logout();

    // 3. Clear server-readable cookies
    Cookies.remove("refresh_token", { path: "/" });

    // 4. Feedback + redirect
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  // Resolve relative URLs for backend uploads
  const getAvatarUrl = () => {
    const img = user?.image;
    if (!img) return undefined;
    if (img.startsWith("http")) return img;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    try {
      const origin = new URL(baseUrl).origin;
      return `${origin}${img}`;
    } catch {
      return img;
    }
  };

  const avatarUrl = getAvatarUrl();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-9 w-9 rounded-full outline-none ring-2 ring-transparent transition-all focus-visible:ring-indigo-500/50 hover:ring-indigo-500/30">
        <Avatar className="h-9 w-9 cursor-pointer border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
          <AvatarImage src={avatarUrl} alt={user?.name || "User"} className="object-cover" />
          <AvatarFallback className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-none" align="end" sideOffset={8}>
        {/* ─── User info header ─── */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-700">
                <AvatarImage src={avatarUrl} alt={user?.name || "User"} className="object-cover" />
                <AvatarFallback className="text-[14px] font-bold text-slate-700 dark:text-slate-300">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-0.5">
                <p className="text-[14px] font-bold leading-none text-slate-900 dark:text-white">
                  {user?.name || "User"}
                </p>
                <p className="text-[13px] leading-none text-slate-500 truncate max-w-[170px]">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />

        {/* ─── Navigation items ─── */}
        <DropdownMenuGroup className="p-1.5">
          <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="cursor-pointer rounded-lg focus:bg-slate-50 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white py-2">
            <User className="mr-2.5 h-4 w-4 text-slate-400" />
            <span className="text-[14px] font-medium">Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/security")} className="cursor-pointer rounded-lg focus:bg-slate-50 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white py-2">
            <Shield className="mr-2.5 h-4 w-4 text-slate-400" />
            <span className="text-[14px] font-medium">Security</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/dashboard/sessions")} className="cursor-pointer rounded-lg focus:bg-slate-50 dark:focus:bg-slate-800 focus:text-slate-900 dark:focus:text-white py-2">
            <Settings className="mr-2.5 h-4 w-4 text-slate-400" />
            <span className="text-[14px] font-medium">Sessions</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-800" />

        {/* ─── Logout ─── */}
        <DropdownMenuGroup className="p-1.5">
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer rounded-lg text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600 py-2"
          >
            <LogOut className="mr-2.5 h-4 w-4 text-red-500" />
            <span className="text-[14px] font-medium">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
