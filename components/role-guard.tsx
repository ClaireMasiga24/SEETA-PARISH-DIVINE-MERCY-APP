import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import type { Role } from "@prisma/client";

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

/**
 * Server component that guards a route by role.
 * Must be used inside a dashboard layout (which already ensures auth).
 * If the user's role is not in the allowed list, redirects to their
 * own role's dashboard.
 */
export default async function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    const { getDashboardPath } = await import("@/lib/roles");
    redirect(getDashboardPath(user.role));
  }

  return <>{children}</>;
}
