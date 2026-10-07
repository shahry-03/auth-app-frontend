const fs = require('fs');
const file = 'src/components/dashboard/admin/manage-user-roles.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { apiClient }')) {
  content = content.replace('import { useState }', 'import { useState }\nimport { apiClient } from "@/lib/api-client";');
}

content = content.replace(
  /const handleAssignRole = async[\s\S]*?\} finally \{[\s\S]*?setIsUpdating\(false\);\n    \}\n  \};/,
  `const handleAssignRole = async (roleId: string) => {
    setIsUpdating(true);
    try {
      await apiClient.post(\`/admin/roles/users/\${userId}/assign/\${roleId}\`);
      toast.success("Role assigned to user");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error assigning role");
    } finally {
      setIsUpdating(false);
    }
  };`
);

content = content.replace(
  /const handleRemoveRole = async[\s\S]*?\} finally \{[\s\S]*?setIsUpdating\(false\);\n    \}\n  \};/,
  `const handleRemoveRole = async (roleId: string) => {
    setIsUpdating(true);
    try {
      await apiClient.delete(\`/admin/roles/users/\${userId}/remove/\${roleId}\`);
      toast.success("Role removed from user");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error removing role");
    } finally {
      setIsUpdating(false);
    }
  };`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed manage-user-roles.tsx');
