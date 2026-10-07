const fs = require('fs');
const file = 'src/components/dashboard/admin/edit-user-form.tsx';
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
      await apiClient.put(\`/admin/users/\${user.id}\`, editData);
      toast.success("User updated successfully");
      setOpen(false);
      // Removed router.refresh() because this is a client page and we'd usually update state instead.
      // But for simplicity we just leave it or let the user refresh.
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error updating user");
    } finally {
      setIsEditing(false);
    }
  };`
);

content = content.replace(
  /const handleUnlock = async[\s\S]*?\} catch \{[\s\S]*?toast\.error\("Error unlocking account"\);\n    \}\n  \};/,
  `const handleUnlock = async () => {
    setIsUnlocking(true);
    try {
      await apiClient.post(\`/admin/users/\${user.id}/unlock\`, {});
      toast.success("User account unlocked");
      window.location.reload();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to unlock account");
    } finally {
      setIsUnlocking(false);
    }
  };`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed edit-user-form.tsx');
