const fs = require('fs');
const path = 'src/app/oauth-callback/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// add import
if (!content.includes('tokenStore')) {
  content = content.replace('import Cookies from "js-cookie";', 'import Cookies from "js-cookie";\nimport { tokenStore } from "@/lib/auth/token-store";');
}

const oldCode = `        if (accessToken) {
          // Save for client-side API calls
          localStorage.setItem("accessToken", accessToken);
          
          // Save for Next.js Server Components (like DashboardLayout)
          Cookies.set("accessToken", accessToken, {
            expires: 1,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
          });`;

const newCode = `        if (accessToken) {
          // Save for client-side API calls in memory
          tokenStore.set(accessToken);`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Patched oauth-callback/page.tsx");
} else {
  console.error("Could not find old code in oauth-callback/page.tsx");
}
