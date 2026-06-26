import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import RoleGuard from "@/components/role-guard";
import DashboardOverview from "@/components/dashboard-overview";

export default async function SecretaryDashboard() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <RoleGuard allowedRoles={["SECRETARY"]}>
      <DashboardOverview user={user} />
    </RoleGuard>
  );
}
