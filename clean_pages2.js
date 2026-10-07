const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync("find src/app/dashboard -name 'page.tsx'").toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Add "use client" if not present
  if (!content.includes('"use client"')) {
    content = '"use client";\n\n' + content;
  }

  // Ensure useAuth is imported
  if (!content.includes('useAuth')) {
    content = content.replace(/import \{ redirect \} from "next\/navigation";/, 'import { redirect } from "next/navigation";\nimport { useAuth } from "@/hooks/useAuth";');
  }

  // Change async function
  content = content.replace(/export default async function/g, 'export default function');

  // Replace auth block
  const blockStart = content.indexOf('  const cookieStore = await cookies();');
  if (blockStart !== -1) {
    const returnStart = content.indexOf('  return (', blockStart);
    if (returnStart !== -1) {
      const authBlock = content.substring(blockStart, returnStart);
      content = content.replace(authBlock, '  const { user } = useAuth();\n  if (!user) return null;\n\n');
    }
  }

  // Remove fetchCurrentUser and getAccessToken completely
  content = content.replace(/async function fetchCurrentUser[\s\S]*?\} catch \{[\s\S]*?return null;\n  \}\n\}\n\n/g, '');
  content = content.replace(/async function fetchPageData[\s\S]*?\} catch \{[\s\S]*?return null;\n  \}\n\}\n\n/g, '');

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Cleaned page blocks');
