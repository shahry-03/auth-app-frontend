const fs = require('fs');
const file = 'src/components/dashboard/admin/permissions-table.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { apiClient }')) {
  content = content.replace('import { useState }', 'import { useState }\nimport { apiClient } from "@/lib/api-client";');
}

content = content.replace(
  /const handleCreate = async[\s\S]*?\} finally \{[\s\S]*?setIsCreating\(false\);\n    \}\n  \};/,
  `const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createData.name.trim()) return;
    
    setIsCreating(true);
    try {
      const res = await apiClient.post('/admin/permissions', createData);
      setPermissions([...permissions, res.data.data]);
      toast.success("Permission created successfully");
      setCreateOpen(false);
      setCreateData({ name: "", description: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error creating permission");
    } finally {
      setIsCreating(false);
    }
  };`
);

content = content.replace(
  /const deletePermission = async[\s\S]*?\} catch \{[\s\S]*?toast\.error\("Error deleting permission"\);\n    \}\n  \};/,
  `const deletePermission = async (permId: string) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;
    try {
      await apiClient.delete(\`/admin/permissions/\${permId}\`);
      setPermissions(permissions.filter((p) => p.id !== permId));
      toast.success("Permission deleted successfully");
    } catch {
      toast.error("Error deleting permission");
    }
  };`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed permissions-table.tsx');
