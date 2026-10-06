"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Camera, Link as LinkIcon, Upload } from "lucide-react";
import Cookies from "js-cookie";
import { apiClient } from "@/lib/api-client";

// ============================================================
//  Deterministic date formatter
// ============================================================
function formatDate(iso: string | null | undefined): string {
  if (!iso) return "N/A";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "N/A";
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  image: string | null;
  enabled: boolean;
  createdAt: string;
  provider: string;
  roles: { roleName: string; permissions: { name: string }[] }[];
}

interface ProfileDetailsProps {
  initialUser: UserProfile;
}

export function ProfileDetails({ initialUser }: ProfileDetailsProps) {
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user.name || "",
    image: user.image || "",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.put<{ data: UserProfile }>("/users/me", {
        name: formData.name,
        image: formData.image,
      });
      setUser(res.data.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to update profile. (Note: If using Base64 images, ensure backend column size is large enough)");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Ignore
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refresh_token", { path: "/" });
    window.location.href = "/login";
  };

  const initials = (formData.name || user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit for safety with Base64
      toast.error("File is too large. Please select an image under 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData({ ...formData, image: base64 });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800/60 px-7 py-5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">Profile Information</CardTitle>
            <CardDescription className="text-[13px] text-slate-500">View and edit your personal details.</CardDescription>
          </div>
          <Button
            variant={isEditing ? "outline" : "default"}
            size="sm"
            onClick={() => {
              if (isEditing) {
                setFormData({ name: user.name || "", image: user.image || "" });
                setIsEditing(false);
              } else {
                setIsEditing(true);
              }
            }}
            className={isEditing ? "" : "bg-indigo-600 hover:bg-indigo-700 text-white"}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-7 space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border border-slate-200 dark:border-slate-700 shadow-sm">
              <AvatarImage src={isEditing ? formData.image : (user.image || "")} alt={user.name || "User"} className="object-cover" />
              <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-2xl font-bold text-slate-500 dark:text-slate-400">
                {initials}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                title="Upload Image"
              >
                <Camera className="h-4 w-4" />
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{isEditing ? (formData.name || "Your Name") : (user.name || "Your Name")}</h3>
            <p className="text-[14.5px] text-slate-500">{user.email}</p>
          </div>
        </div>

        {/* Form Details */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="h-10"
              />
            ) : (
              <div className="text-[14.5px] font-medium text-slate-900 dark:text-slate-200">{user.name || "N/A"}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</Label>
            <div className="text-[14.5px] font-medium text-slate-900 dark:text-slate-200">{user.email}</div>
          </div>

          {isEditing && (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="image" className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Profile Image URL (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/avatar.jpg"
                  className="h-10"
                />
              </div>
              <p className="text-[12px] text-slate-500 mt-1">
                You can paste an image URL or click the camera icon on your avatar to upload a file directly.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Auth Provider</Label>
            <div className="text-[14.5px] font-medium text-slate-900 dark:text-slate-200">{user.provider || "LOCAL"}</div>
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Roles</Label>
            <div className="text-[14.5px] font-medium text-slate-900 dark:text-slate-200">
              {user.roles && user.roles.length > 0
                ? user.roles.map((r) => r.roleName).join(", ")
                : "USER"}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Joined On</Label>
            <div className="text-[14.5px] font-medium text-slate-900 dark:text-slate-200">
              {formatDate(user.createdAt)}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800/60">
            <Button onClick={handleSave} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
      <div className="flex justify-start px-7 pb-7">
        <Button variant="destructive" onClick={handleLogout} className="bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 border-0 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20">
          Logout of Account
        </Button>
      </div>
    </Card>
  );
}
