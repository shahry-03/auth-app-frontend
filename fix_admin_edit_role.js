const fs = require('fs');
const file = 'src/components/dashboard/admin/edit-role-form.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import { apiClient }')) {
  content = content.replace('import { useState }', 'import { useState }\nimport { apiClient } from "@/lib/api-client";');
}

content = content.replace(
  /const handleEdit = async[\s\S]*?\} finally \{[\s\S]*?setIsEditing\(false\);\n    \}\n  \};/,
  `const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(true);
    try {
      await apiClient.put(\`/admin/roles/\${role.id}\`, editData);
      toast.success("Role updated successfully");
      setOpen(false);
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error updating role");
    } finally {
      setIsEditing(false);
    }
  };`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed edit-role-form.tsx');
