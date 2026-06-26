import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ROLE_LABELS } from "@/lib/roles";
import EditUserForm from "./edit-user-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: Props) {
  const admin = await getAuthenticatedUser();

  if (!admin) {
    redirect("/login");
  }

  if (admin.role !== "ADMINISTRATOR") {
    redirect("/dashboard");
  }

  const { id } = await params;

  // Cannot edit self
  if (id === admin.id) {
    redirect("/dashboard/administrator/users");
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  if (!user) {
    notFound();
  }

  // Cannot edit another ADMINISTRATOR
  if (user.role === "ADMINISTRATOR") {
    redirect("/dashboard/administrator/users");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <a
          href="/dashboard/administrator/users"
          className="mb-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider transition-colors"
          style={{ color: "rgba(11, 19, 43, 0.4)" }}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Users
        </a>
        <h1 className="font-heading text-2xl font-bold tracking-wide text-navy-800">
          Edit User
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(11, 19, 43, 0.5)" }}>
          {user.name} &mdash; {ROLE_LABELS[user.role] || user.role}
        </p>
      </div>

      <EditUserForm user={user} />
    </div>
  );
}
