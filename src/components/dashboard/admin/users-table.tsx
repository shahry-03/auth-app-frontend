"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  email: string;
  name: string;
  enabled: boolean;
  provider: string;
  createdAt: string;
  roles: { roleName: string }[];
}

export function UsersTable({
  initialUsers,
  accessToken,
}: {
  initialUsers: User[];
  accessToken: string;
}) {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await apiClient.patch(`/admin/users/${userId}/status?enabled=${!currentStatus}`);
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, enabled: !currentStatus } : u
        )
      );
      toast.success(`User ${!currentStatus ? "enabled" : "disabled"} successfully`);
    } catch {
      toast.error("Error updating user");
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiClient.delete(`/admin/users/${userId}`);
      setUsers(users.filter((u) => u.id !== userId));
      toast.success("User deleted successfully");
    } catch {
      toast.error("Error deleting user");
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((r) => (
                        <span
                          key={r.roleName}
                          className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                        >
                          {r.roleName}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.enabled
                          ? "bg-green-500/10 text-green-600"
                          : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {user.enabled ? "Active" : "Inactive"}
                    </span>
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
                        <DropdownMenuItem render={<Link href={`/dashboard/admin/users/${user.id}`}>View Details</Link>} />
                        <DropdownMenuItem
                          onClick={() => toggleUserStatus(user.id, user.enabled)}
                        >
                          {user.enabled ? "Disable User" : "Enable User"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete User
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
  );
}
