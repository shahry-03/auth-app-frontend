import { ReactNode } from "react";
import { UserNav } from "@/components/dashboard/user-nav";
import { getUserId } from "universal-auth-nextjs";
import { getUserById } from "universal-auth-nextjs";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const userId = await getUserId();
  
  if (!userId) {
    redirect("/login");
  }

  let user = null;
  try {
    user = await getUserById(userId);
  } catch (error) {
    // If fetching user fails, they might have an invalid token
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-xl">AuthApp</span>
          </div>
          <UserNav user={user} />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
