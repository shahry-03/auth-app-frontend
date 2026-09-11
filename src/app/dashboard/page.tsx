import { getUserId } from "@/app/actions/auth";
import { getUserById } from "@/services/authService";
import { redirect } from "next/navigation";
import { ProfileDetails } from "@/components/dashboard/profile-details";

export default async function DashboardPage() {
  const userId = await getUserId();
  
  if (!userId) {
    redirect("/login");
  }

  const user = await getUserById(userId);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your account settings and view your profile information.
        </p>
      </div>
      
      <ProfileDetails initialUser={user} />
    </div>
  );
}
