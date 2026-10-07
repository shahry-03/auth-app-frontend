"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export function EditRoleForm({
  role,
  allPermissions,
  accessToken,
}: {
  role: any;
  allPermissions: any[];
  accessToken: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{ description: string; permissions: string[] }>({
    description: role.description || "",
    permissions: role.permissions?.map((p: any) => p.name) || [],
  });

  const togglePermission = (permName: string) => {
    setEditData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permName)
        ? prev.permissions.filter((p) => p !== permName)
        : [...prev.permissions, permName],
    }));
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(true);
    try {
      await apiClient.put(`/admin/roles/${role.id}`, editData);
      toast.success("Role updated successfully");
      setOpen(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error updating role");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        // reset form on close
        setEditData({
          description: role.description || "",
          permissions: role.permissions?.map((p: any) => p.name) || [],
        });
      }
    }}>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>Edit Role</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleEdit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              placeholder="Description of the role"
            />
          </div>
          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="max-h-48 overflow-y-auto rounded-md border p-2 space-y-2">
              {allPermissions.map((perm) => (
                <label key={perm.id} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editData.permissions.includes(perm.name)}
                    onChange={() => togglePermission(perm.name)}
                    className="rounded border-gray-300"
                  />
                  <span>{perm.name}</span>
                </label>
              ))}
              {allPermissions.length === 0 && (
                <p className="text-xs text-muted-foreground">No permissions found.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isEditing}>
              {isEditing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
