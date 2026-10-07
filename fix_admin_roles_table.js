const fs = require('fs');
const file = 'src/components/dashboard/admin/roles-table.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { apiClient }')) {
  content = content.replace('import { useState }', 'import { useState }\nimport { apiClient } from "@/lib/api-client";');
}

content = content.replace(
  /const handleCreate = async[\s\S]*?\} finally \{[\s\S]*?setIsCreating\(false\);\n    \}\n  \};/,
  `const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createData.roleName.trim()) return;
    
    setIsCreating(true);
    try {
      const res = await apiClient.post('/admin/roles', createData);
      setRoles([...roles, res.data.data]);
      toast.success("Role created successfully");
      setCreateOpen(false);
      setCreateData({ roleName: "", description: "", permissions: [] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error creating role");
    } finally {
      setIsCreating(false);
    }
  };`
);

content = content.replace(
  /const deleteRole = async[\s\S]*?\} catch \{[\s\S]*?toast\.error\("Error deleting role"\);\n    \}\n  \};/,
  `const deleteRole = async (roleId: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await apiClient.delete(\`/admin/roles/\${roleId}\`);
      setRoles(roles.filter((r) => r.id !== roleId));
      toast.success("Role deleted successfully");
    } catch {
      toast.error("Error deleting role");
    }
  };`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed roles-table.tsx');
