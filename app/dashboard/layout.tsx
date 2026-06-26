import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { getDashboardPath, ROLE_SLUGS } from "@/lib/roles";
import DashboardLayoutClient from "@/components/dashboard-layout";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Root dashboard layout — server-side guard.
 * Every dashboard route passes through here.
 * If not authenticated, redirects to /login.
 */
export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayoutClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    >
      {children}
    </DashboardLayoutClient>
  );
}
