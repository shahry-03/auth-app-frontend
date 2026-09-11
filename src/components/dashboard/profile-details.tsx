"use client";

import { useState } from "react";
import { UserDto } from "universal-auth-nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateUser } from "universal-auth-nextjs";
import { Loader2 } from "lucide-react";

interface ProfileDetailsProps {
  initialUser: UserDto;
}

export function ProfileDetails({ initialUser }: ProfileDetailsProps) {
  const [user, setUser] = useState<UserDto>(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name || "",
    image: user.image || "",
  });

  const handleSave = async () => {
    if (!user.id) return;
    
    setIsLoading(true);
    try {
      const updatedUser = await updateUser(user.id, {
        ...user,
        name: formData.name,
        image: formData.image,
      });
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              View and edit your personal details.
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              if (isEditing) {
                // Cancel
                setFormData({ name: user.name || "", image: user.image || "" });
                setIsEditing(false);
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            ) : (
              <div className="text-sm font-medium">{user.name || "N/A"}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="text-sm font-medium">{user.email}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="provider">Auth Provider</Label>
            <div className="text-sm font-medium">{user.provider || "LOCAL"}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roles">Roles</Label>
            <div className="text-sm font-medium">
              {user.roles && user.roles.length > 0 
                ? user.roles.map((r: any) => r.role).join(", ") 
                : "USER"}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="created">Joined On</Label>
            <div className="text-sm font-medium">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
      <div className="flex justify-start px-6 pb-6">
        <Button 
          variant="destructive" 
          onClick={async () => {
            const { logout } = await import("universal-auth-nextjs");
            await logout();
            window.location.href = "/login";
          }}
        >
          Logout of Account
        </Button>
      </div>
    </Card>
  );
}
