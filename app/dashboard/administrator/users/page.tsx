import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLE_LABELS } from "@/lib/roles";
import UsersListClient from "./users-list-client";

export default async function AdminUsersPage() {
  const admin = await getAuthenticatedUser();

  if (!admin) {
    redirect("/login");
  }

  if (admin.role !== "ADMINISTRATOR") {
    redirect("/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-wide text-navy-800">
            Manage Users
          </h1>
          <p className="mt-1 text-sm" style={{ color: "rgba(11, 19, 43, 0.5)" }}>
            Create, edit, and manage parish accounts
          </p>
        </div>
        <a
          href="/dashboard/administrator/users/create"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide text-navy-900 transition-all duration-300 hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, #E8C462, #C9A84C)",
            boxShadow: "0 4px 16px rgba(201, 168, 76, 0.3)",
          }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create User
        </a>
      </div>

      {/* Users list */}
      <UsersListClient users={users} adminId={admin.id} roleLabels={ROLE_LABELS} />
    </div>
  );
}
