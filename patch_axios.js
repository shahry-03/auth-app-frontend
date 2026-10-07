const fs = require('fs');
const cp = require('child_process');

const files = cp.execSync("grep -rl 'async function getAccessToken' src/").toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Ensure axios is imported
  if (!content.includes("import axios")) {
    content = content.replace('import { cookies', 'import axios from "axios";\nimport { cookies');
  }

  // Update getAccessToken to use axios
  const newLogic = `async function getAccessToken(cookieHeader: string, userAgent?: string, clientIp?: string): Promise<string | null> {
  try {
    const res = await axios.post(
      \`\${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/auth/refresh\`,
      {},
      {
        headers: {
          Cookie: cookieHeader,
          "User-Agent": userAgent || "Mozilla/5.0",
          "X-Forwarded-For": clientIp || "127.0.0.1",
          "Origin": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "Referer": (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") + "/dashboard"
        },
        withCredentials: true
      }
    );
    return res.data?.data?.accessToken || null;
  } catch (error: any) {
    console.error("refresh failed", error?.response?.status, error?.response?.data);
    return null;
  }
}`;

  content = content.replace(/async function getAccessToken[\s\S]*?\} catch \{[\s\S]*?return null;\n  \}\n\}/, newLogic);

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Patched to use axios');
