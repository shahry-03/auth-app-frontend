"use client";

import { useState, useRef, useEffect } from "react";
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
import { Loader2, Camera, Trash2, X } from "lucide-react";
import Cookies from "js-cookie";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { tokenStore } from "@/lib/auth/token-store";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/api/files";

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
  const router = useRouter();
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user.name || "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSave = async () => {
    setIsSaving(true);
    let finalImageUrl: string | undefined = undefined;

    // STEP 1 & 2: Handle Upload if new file selected
    if (selectedFile) {
      try {
        finalImageUrl = await uploadFile(selectedFile, "profile");
      } catch (error: any) {
        const message = error.response?.data?.message || "Failed to upload profile image. Please try again.";
        toast.error(message);
        setIsSaving(false);
        return; // STOP flow, don't update user
      }
    } else if (removeExistingImage) {
      finalImageUrl = "";
    }

    // STEP 3: Update user profile
    const payload: Record<string, any> = {
      name: formData.name,
    };
    if (finalImageUrl !== undefined) {
      payload.image = finalImageUrl;
    }

    try {
      const res = await apiClient.put<{ data: UserProfile }>("/users/me", payload);
      const updatedUser = res.data.data;
      
      setUser(updatedUser);
      useAuthStore.setState({ user: updatedUser as any });
      setIsEditing(false);
      
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setRemoveExistingImage(false);

      toast.success("Profile updated successfully.");
      router.refresh();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update profile. Please try again.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Ignore
    }
    tokenStore.clear();
    localStorage.removeItem("user");
    useAuthStore.getState().logout();
    Cookies.remove("refresh_token", { path: "/" });
    window.location.href = "/login";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, WEBP, and GIF images are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be 2MB or less.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setRemoveExistingImage(false);
    
    // Clear input so same file can be selected again if canceled
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancelNewImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleRemoveExistingImage = () => {
    setRemoveExistingImage(true);
    handleCancelNewImage();
  };

  const handleCancelEdit = () => {
    setFormData({ name: user.name || "" });
    handleCancelNewImage();
    setRemoveExistingImage(false);
    setIsEditing(false);
  };

  const initials = (formData.name || user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const getDisplayedAvatarUrl = () => {
    if (previewUrl) return previewUrl;
    if (removeExistingImage) return undefined;
    
    if (!user.image) return undefined;
    if (user.image.startsWith("http")) return user.image;
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    try {
      const origin = new URL(baseUrl).origin;
      return `${origin}${user.image}`;
    } catch {
      return user.image;
    }
  };

  const displayedAvatar = getDisplayedAvatarUrl();

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
            onClick={isEditing ? handleCancelEdit : () => setIsEditing(true)}
            className={isEditing ? "" : "bg-indigo-600 hover:bg-indigo-700 text-white"}
            disabled={isSaving}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-7 space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
              <AvatarImage src={displayedAvatar} alt={user.name || "User"} className="object-cover" />
              <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-2xl font-bold text-slate-500 dark:text-slate-400">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {isEditing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-white hover:text-indigo-200 flex flex-col items-center gap-1"
                >
                  <Camera className="h-5 w-5" />
                  <span className="text-[10px] font-semibold">Change</span>
                </button>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{isEditing ? (formData.name || "Your Name") : (user.name || "Your Name")}</h3>
              <p className="text-[14.5px] text-slate-500">{user.email}</p>
            </div>
            
            {isEditing && (
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="h-8 text-[12px]"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                >
                  Change Photo
                </Button>
                
                {selectedFile && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="h-8 text-[12px] text-slate-500"
                    onClick={handleCancelNewImage}
                    disabled={isSaving}
                  >
                    <X className="mr-1.5 h-3 w-3" />
                    Cancel
                  </Button>
                )}

                {!selectedFile && (user.image || previewUrl) && !removeExistingImage && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="h-8 text-[12px] text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    onClick={handleRemoveExistingImage}
                    disabled={isSaving}
                  >
                    <Trash2 className="mr-1.5 h-3 w-3" />
                    Remove
                  </Button>
                )}
              </div>
            )}
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
                disabled={isSaving}
              />
            ) : (
              <div className="text-[14.5px] font-medium text-slate-900 dark:text-slate-200">{user.name || "N/A"}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</Label>
            <div className="text-[14.5px] font-medium text-slate-900 dark:text-slate-200">{user.email}</div>
          </div>

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
            <Button 
              onClick={handleSave} 
              disabled={isSaving} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[130px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
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
