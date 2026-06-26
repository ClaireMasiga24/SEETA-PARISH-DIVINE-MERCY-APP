import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import RoleGuard from "@/components/role-guard";
import DashboardOverview from "@/components/dashboard-overview";

export default async function PublicRelationsOfficerDashboard() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <RoleGuard allowedRoles={["PUBLIC_RELATIONS_OFFICER"]}>
      <DashboardOverview user={user} />
    </RoleGuard>
  );
}
