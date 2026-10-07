const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync("grep -rl 'async function getAccessToken' src/").toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');

  // 1. Add "use client"
  if (!content.includes('"use client"')) {
    content = '"use client";\n\n' + content;
  }

  // 2. Remove getAccessToken
  content = content.replace(/async function getAccessToken[\s\S]*?\} catch \(error: any\) \{[\s\S]*?return null;\n  \}\n\}\n\n?/g, '');
  
  // 3. Remove fetchCurrentUser or similar (some might have fetchPageData, etc. Wait, I will just remove the auth check from the component)
  // Let's first replace the auth check
  const authCheckRegex = /const reqHeaders = await headers\(\);[\s\S]*?if \(!user\) redirect\("\/login"\);/g;
  content = content.replace(authCheckRegex, 'const { user } = useAuth();\n  if (!user) return null;');

  const authCheckRegex2 = /const reqHeaders = await headers\(\);[\s\S]*?if \(!accessToken\) redirect\("\/login"\);/g;
  content = content.replace(authCheckRegex2, 'const { user } = useAuth();\n  if (!user) return null;');

  // Let's replace the async function keyword
  content = content.replace(/export default async function/g, 'export default function');

  // Replace imports
  content = content.replace(/import \{ cookies, headers \} from "next\/headers";\n/g, '');
  content = content.replace(/import \{ cookies \} from "next\/headers";\n/g, '');
  content = content.replace(/import axios from "axios";\n/g, '');
  
  if (!content.includes('useAuth')) {
    content = content.replace(/import \{ redirect \} from "next\/navigation";/, 'import { redirect } from "next/navigation";\nimport { useAuth } from "@/hooks/useAuth";');
  }

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Cleaned pages');
