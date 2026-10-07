"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2, Unlock, ShieldAlert } from "lucide-react";
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

export function EditUserForm({
  user,
  accessToken,
}: {
  user: any;
  accessToken: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name || "",
  });

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(true);
    try {
      await apiClient.put(`/admin/users/${user.id}`, editData);
      toast.success("User updated successfully");
      setOpen(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error updating user");
    } finally {
      setIsEditing(false);
    }
  };

  const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      // Use apiClient instead of fetch to ensure proper token handling
      const res = await apiClient.post(`/admin/users/${user.id}/unlock`);
      toast.success("User account unlocked");
      setOpen(false);
      window.location.reload();
    } catch {
      toast.error("Error unlocking user");
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={(val) => {
        setOpen(val);
        if (!val) setEditData({ name: user.name || "" });
      }}>
        <DialogTrigger className={buttonVariants({ variant: "outline" })}>Edit User</DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="User's full name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <Label className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <ShieldAlert className="h-4 w-4" /> Security Actions
              </Label>
              <div className="flex items-center justify-between rounded-lg border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 p-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Clear Lockout</p>
                  <p className="text-xs text-muted-foreground">Force unlock brute-force restrictions.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={handleUnlock} disabled={isUnlocking} className="text-red-600 hover:text-red-700 hover:bg-red-100/50">
                  {isUnlocking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Unlock className="mr-2 h-4 w-4" />}
                  Force Unlock
                </Button>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isEditing}>
                {isEditing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
