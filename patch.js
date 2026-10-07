const fs = require('fs');
const path = 'src/components/auth/LoginForm.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldCode = `  const completeLogin = (
    accessToken: string,
    user: Record<string, unknown>
  ) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    Cookies.set("accessToken", accessToken, {
      expires: 1,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    toast.success("Welcome back!");
    router.push(callbackUrl);
    router.refresh();
  };`;

const newCode = `  const completeLogin = (
    accessToken: string,
    user: Record<string, unknown>
  ) => {
    tokenStore.set(accessToken);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Welcome back!");
    router.push(callbackUrl);
    router.refresh();
  };`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Patched LoginForm.tsx");
} else {
  console.error("Could not find old code in LoginForm.tsx");
}
