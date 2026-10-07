const fs = require('fs');

// 1. Update useAuth.ts
let useAuthPath = 'src/hooks/useAuth.ts';
let useAuthContent = fs.readFileSync(useAuthPath, 'utf8');
if (!useAuthContent.includes('export function clearAuthCache')) {
  useAuthContent += '\nexport function clearAuthCache() {\n  globalUserCache = null;\n  globalIsLoading = true;\n  fetchPromise = null;\n}\n';
  fs.writeFileSync(useAuthPath, useAuthContent, 'utf8');
}

// 2. Update user-nav.tsx
let userNavPath = 'src/components/dashboard/user-nav.tsx';
let userNavContent = fs.readFileSync(userNavPath, 'utf8');
if (!userNavContent.includes('clearAuthCache')) {
  userNavContent = userNavContent.replace(
    'import { tokenStore } from "@/lib/auth/token-store";',
    'import { tokenStore } from "@/lib/auth/token-store";\nimport { clearAuthCache } from "@/hooks/useAuth";'
  );
  userNavContent = userNavContent.replace(
    'tokenStore.clear();',
    'clearAuthCache();\n    tokenStore.clear();'
  );
  fs.writeFileSync(userNavPath, userNavContent, 'utf8');
}

// 3. Update LoginForm.tsx
let loginFormPath = 'src/components/auth/LoginForm.tsx';
let loginFormContent = fs.readFileSync(loginFormPath, 'utf8');
if (!loginFormContent.includes('clearAuthCache')) {
  loginFormContent = loginFormContent.replace(
    'import { tokenStore } from "@/lib/auth/token-store";',
    'import { tokenStore } from "@/lib/auth/token-store";\nimport { clearAuthCache } from "@/hooks/useAuth";'
  );
  loginFormContent = loginFormContent.replace(
    'tokenStore.set(accessToken);',
    'clearAuthCache();\n    tokenStore.set(accessToken);'
  );
  fs.writeFileSync(loginFormPath, loginFormContent, 'utf8');
}

console.log("Patched auth caching!");
