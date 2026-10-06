"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Plus, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Permission {
  id: string;
  name: string;
  description: string;
}

export function PermissionsTable({
  initialPermissions,
  accessToken,
}: {
  initialPermissions: Permission[];
  accessToken: string;
}) {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [isCreating, setIsCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createData, setCreateData] = useState({ name: "", description: "" });

  const [editOpen, setEditOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{ id: string; description: string } | null>(null);

  const deletePermission = async (permissionId: string) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/admin/permissions/${permissionId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (res.ok) {
        setPermissions(permissions.filter((p) => p.id !== permissionId));
        toast.success("Permission deleted successfully");
      } else {
        toast.error("Failed to delete permission");
      }
    } catch {
      toast.error("Error deleting permission");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createData.name.trim()) return;
    
    setIsCreating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/admin/permissions`,
        {
          method: "POST",
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(createData),
        }
      );
      
      const json = await res.json();
      if (res.ok) {
        setPermissions([...permissions, json.data]);
        toast.success("Permission created successfully");
        setCreateOpen(false);
        setCreateData({ name: "", description: "" });
      } else {
        toast.error(json.message || "Failed to create permission");
      }
    } catch {
      toast.error("Error creating permission");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    
    setIsEditing(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/admin/permissions/${editData.id}`,
        {
          method: "PUT",
          headers: { 
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ description: editData.description }),
        }
      );
      
      const json = await res.json();
      if (res.ok) {
        setPermissions(permissions.map(p => p.id === editData.id ? { ...p, description: editData.description } : p));
        toast.success("Permission updated successfully");
        setEditOpen(false);
        setEditData(null);
      } else {
        toast.error(json.message || "Failed to update permission");
      }
    } catch {
      toast.error("Error updating permission");
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Permissions</h2>
        
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger className={buttonVariants({ size: "sm" })}>
            <Plus className="mr-2 h-4 w-4" />
            Create Permission
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Permission</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Permission Name</Label>
                <Input 
                  id="name" 
                  value={createData.name}
                  onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                  placeholder="e.g. user:read" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  value={createData.description}
                  onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                  placeholder="Description of the permission" 
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={(val) => { setEditOpen(val); if (!val) setEditData(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                value={editData?.description || ""}
                onChange={(e) => setEditData(prev => prev ? { ...prev, description: e.target.value } : null)}
                placeholder="Description of the permission" 
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isEditing}>
                {isEditing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Permission Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {permissions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-muted-foreground">
                    No permissions found.
                  </td>
                </tr>
              ) : (
                permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{permission.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {permission.description || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent bg-transparent text-sm font-medium hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditData({ id: permission.id, description: permission.description || "" });
                              setEditOpen(true);
                            }}
                          >
                            Edit Permission
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => deletePermission(permission.id)}
                          >
                            Delete Permission
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
