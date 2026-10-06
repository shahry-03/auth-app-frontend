"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MoreHorizontal, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
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

interface Role {
  id: string;
  roleName: string;
  description: string;
  permissions: { name: string; description: string }[];
}

export function RolesTable({
  initialRoles,
  accessToken,
  allPermissions = [],
}: {
  initialRoles: Role[];
  accessToken: string;
  allPermissions?: Permission[];
}) {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isCreating, setIsCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createData, setCreateData] = useState<{ roleName: string; description: string; permissions: string[] }>({
    roleName: "",
    description: "",
    permissions: [],
  });

  const togglePermission = (permName: string) => {
    setCreateData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permName)
        ? prev.permissions.filter(p => p !== permName)
        : [...prev.permissions, permName]
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createData.roleName.trim()) return;
    
    setIsCreating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/admin/roles`,
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
        setRoles([...roles, json.data]);
        toast.success("Role created successfully");
        setCreateOpen(false);
        setCreateData({ roleName: "", description: "", permissions: [] });
      } else {
        toast.error(json.message || "Failed to create role");
      }
    } catch {
      toast.error("Error creating role");
    } finally {
      setIsCreating(false);
    }
  };

  const deleteRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/admin/roles/${roleId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (res.ok) {
        setRoles(roles.filter((r) => r.id !== roleId));
        toast.success("Role deleted successfully");
      } else {
        toast.error("Failed to delete role");
      }
    } catch {
      toast.error("Error deleting role");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Roles</h2>
        
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger className={buttonVariants({ size: "sm" })}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input 
                  id="roleName" 
                  value={createData.roleName}
                  onChange={(e) => setCreateData({ ...createData, roleName: e.target.value.toUpperCase() })}
                  placeholder="e.g. EDITOR" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  value={createData.description}
                  onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
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
                        checked={createData.permissions.includes(perm.name)}
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

      <div className="rounded-md border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Role Name</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Permissions</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {roles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    No roles found.
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{role.roleName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {role.description || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.map((p) => (
                          <span
                            key={p.name}
                            className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
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
                          <DropdownMenuItem render={<Link href={`/dashboard/admin/roles/${role.id}`}>View Details</Link>} />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => deleteRole(role.id)}
                          >
                            Delete Role
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
