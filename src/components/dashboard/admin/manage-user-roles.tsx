"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ManageUserRoles({
  userId,
  userRoles,
  allRoles,
  accessToken,
}: {
  userId: string;
  userRoles: any[];
  allRoles: any[];
  accessToken: string;
}) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const assignedRoleIds = userRoles.map(r => r.id);
  const unassignedRoles = allRoles.filter(r => !assignedRoleIds.includes(r.id));

  const handleAssignRole = async (roleId: string) => {
    setIsUpdating(true);
    try {
      await apiClient.post(`/admin/roles/users/${userId}/assign/${roleId}`);
      toast.success("Role assigned to user");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error assigning role");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    setIsUpdating(true);
    try {
      await apiClient.delete(`/admin/roles/users/${userId}/remove/${roleId}`);
      toast.success("Role removed from user");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error removing role");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {isUpdating && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating roles...
        </div>
      )}
      
      <div>
        <h4 className="text-sm font-medium mb-2">Assigned Roles</h4>
        <div className="flex flex-wrap gap-2">
          {userRoles.map(role => (
            <div key={role.id} className="flex items-center gap-1 rounded-full bg-primary/10 pl-2.5 pr-1 py-1 text-xs font-medium text-primary">
              {role.roleName}
              <button 
                disabled={isUpdating}
                onClick={() => handleRemoveRole(role.id)}
                className="rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                title="Remove role"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {userRoles.length === 0 && <span className="text-xs text-muted-foreground">No roles assigned</span>}
        </div>
      </div>

      {unassignedRoles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Available Roles</h4>
          <div className="flex flex-wrap gap-2">
            {unassignedRoles.map(role => (
              <div key={role.id} className="flex items-center gap-1 rounded-full border px-2 py-1 text-xs text-muted-foreground">
                {role.roleName}
                <button 
                  disabled={isUpdating}
                  onClick={() => handleAssignRole(role.id)}
                  className="rounded-full p-0.5 hover:bg-muted transition-colors text-foreground"
                  title="Assign role"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
