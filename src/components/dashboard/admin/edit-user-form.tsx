"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Unlock } from "lucide-react";
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/admin/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        }
      );

      const json = await res.json();
      if (res.ok) {
        toast.success("User updated successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(json.message || "Failed to update user");
      }
    } catch {
      toast.error("Error updating user");
    } finally {
      setIsEditing(false);
    }
  };

  const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/admin/users/${user.id}/unlock`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (res.ok) {
        toast.success("User account unlocked");
        router.refresh();
      } else {
        toast.error("Failed to unlock user");
      }
    } catch {
      toast.error("Error unlocking user");
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handleUnlock} disabled={isUnlocking}>
        {isUnlocking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Unlock className="mr-2 h-4 w-4" />}
        Unlock Account
      </Button>

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
            {/* Note: In a real system, you might not want to edit email if it's tied to an identity provider */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
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
    </div>
  );
}
