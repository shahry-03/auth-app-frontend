const fs = require('fs');
const file = 'src/components/dashboard/admin/users-table.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
if (!content.includes('import { apiClient }')) {
  content = content.replace('import { useState }', 'import { useState }\nimport { apiClient } from "@/lib/api-client";');
}

// Replace toggleUserStatus
content = content.replace(
  /const toggleUserStatus = async[\s\S]*?\} catch \{[\s\S]*?toast\.error\("Error updating user"\);\n    \}\n  \};/,
  `const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await apiClient.patch(\`/admin/users/\${userId}/status?enabled=\${!currentStatus}\`);
      setUsers(
        users.map((u) =>
          u.id === userId ? { ...u, enabled: !currentStatus } : u
        )
      );
      toast.success(\`User \${!currentStatus ? "enabled" : "disabled"} successfully\`);
    } catch {
      toast.error("Error updating user");
    }
  };`
);

// Replace deleteUser
content = content.replace(
  /const deleteUser = async[\s\S]*?\} catch \{[\s\S]*?toast\.error\("Error deleting user"\);\n    \}\n  \};/,
  `const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiClient.delete(\`/admin/users/\${userId}\`);
      setUsers(users.filter((u) => u.id !== userId));
      toast.success("User deleted successfully");
    } catch {
      toast.error("Error deleting user");
    }
  };`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed users-table.tsx');
