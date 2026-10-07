const fs = require('fs');
const path = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldCode = `export default async function DashboardOverviewPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) redirect("/login");`;

const newCode = `async function getAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(
      \`\${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"}/auth/refresh\`,
      {
        method: "POST",
        headers: { Cookie: \`refresh_token=\${refreshToken}\` },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.accessToken || null;
  } catch {
    return null;
  }
}

export default async function DashboardOverviewPage() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) redirect("/login");
  const accessToken = await getAccessToken(refreshToken);
  if (!accessToken) redirect("/login");`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Patched page.tsx");
} else {
  console.error("Could not find old code in page.tsx");
}
