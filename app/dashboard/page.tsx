import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { getDashboardPath } from "@/lib/roles";

/**
 * /dashboard — root dashboard redirect.
 * Automatically redirects to the user's role-specific dashboard.
 */
export default async function DashboardRoot() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  redirect(getDashboardPath(user.role));
}
