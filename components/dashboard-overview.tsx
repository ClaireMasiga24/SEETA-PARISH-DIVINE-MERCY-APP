import type { Role } from "@prisma/client";
import { ROLE_LABELS, ROLE_TITLE_SUFFIX, ALL_ROLES } from "@/lib/roles";
import { prisma } from "@/lib/prisma";

interface DashboardOverviewProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
  };
}

/**
 * Server component rendering a role-specific dashboard overview.
 */
export default async function DashboardOverview({ user }: DashboardOverviewProps) {
  // Total users count for all roles (visible to all)
  const totalUsers = await prisma.user.count();

  // Role-specific stats
  let stats: { label: string; value: string | number; description: string }[] = [];

  switch (user.role) {
    case "ADMINISTRATOR":
      stats = [
        { label: "Total Users", value: totalUsers, description: "Registered parishioners" },
        { label: "Active Users", value: await prisma.user.count({ where: { isActive: true } }), description: "Active accounts" },
        { label: "Inactive Users", value: await prisma.user.count({ where: { isActive: false } }), description: "Deactivated accounts" },
        {
          label: "Roles",
          value: ALL_ROLES.length,
          description: `${ALL_ROLES.length} distinct roles`,
        },
      ];
      break;
    case "PATRON":
      stats = [
        { label: "Community", value: totalUsers, description: "Registered members" },
        { label: "Role", value: "PATRON", description: "Spiritual oversight" },
      ];
      break;
    case "CHAIRPERSON":
      stats = [
        { label: "Community", value: totalUsers, description: "Registered members" },
        { label: "Role", value: "CHAIRPERSON", description: "Leadership & coordination" },
      ];
      break;
    case "SECRETARY":
      stats = [
        { label: "Community", value: totalUsers, description: "Registered members" },
        { label: "Role", value: "SECRETARY", description: "Records & communication" },
      ];
      break;
    case "TREASURER":
      stats = [
        { label: "Community", value: totalUsers, description: "Registered members" },
        { label: "Role", value: "TREASURER", description: "Financial stewardship" },
      ];
      break;
    case "MEMBERSHIP_COORDINATOR":
      stats = [
        { label: "Community", value: totalUsers, description: "Registered members" },
        { label: "Role", value: "MEMBERSHIP COORDINATOR", description: "Member engagement" },
      ];
      break;
    case "PUBLIC_RELATIONS_OFFICER":
      stats = [
        { label: "Community", value: totalUsers, description: "Registered members" },
        { label: "Role", value: "PUBLIC RELATIONS", description: "Outreach & communication" },
      ];
      break;
    case "MEMBER":
      stats = [
        { label: "Community", value: totalUsers, description: "Fellow parishioners" },
        { label: "Joined", value: user.createdAt.toLocaleDateString(), description: "Your membership date" },
      ];
      break;
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-wide text-navy-800 sm:text-3xl">
          Welcome, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "rgba(11, 19, 43, 0.5)" }}>
          {ROLE_TITLE_SUFFIX[user.role]}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border p-5 transition-all duration-200 hover:shadow-md"
            style={{
              background: "rgba(253, 252, 250, 0.85)",
              borderColor: "rgba(201, 168, 76, 0.15)",
            }}
          >
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(11, 19, 43, 0.4)" }}>
              {stat.label}
            </p>
            <p className="mt-1.5 font-heading text-2xl font-bold text-navy-800">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[11px]" style={{ color: "rgba(11, 19, 43, 0.4)" }}>
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Role-specific welcome card */}
      <div
        className="rounded-xl border p-6"
        style={{
          background: "rgba(253, 252, 250, 0.85)",
          borderColor: "rgba(201, 168, 76, 0.15)",
        }}
      >
        <h2 className="font-heading text-lg font-semibold text-navy-800">
          {getRoleMessage(user.role).title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "rgba(11, 19, 43, 0.6)" }}>
          {getRoleMessage(user.role).message}
        </p>
      </div>
    </div>
  );
}

function getRoleMessage(role: Role): { title: string; message: string } {
  switch (role) {
    case "ADMINISTRATOR":
      return {
        title: "Sanctuary Steward",
        message:
          "You are entrusted with the oversight of this sacred digital sanctuary. From here, you may manage user accounts, assign roles, and ensure the community runs smoothly. May the Divine Mercy guide your stewardship.",
      };
    case "PATRON":
      return {
        title: "Spiritual Guardian",
        message:
          "As Patron, you hold a special place in the spiritual life of our community. Your wisdom and intercession guide the faithful of Seeta Parish. Use this dashboard to stay connected with the community's spiritual life.",
      };
    case "CHAIRPERSON":
      return {
        title: "Community Shepherd",
        message:
          "As Chairperson, you lead and coordinate the activities of our parish community. Your leadership helps unite the faithful in devotion and service. This dashboard is your command center for parish coordination.",
      };
    case "SECRETARY":
      return {
        title: "Keeper of Records",
        message:
          "As Secretary, you maintain the sacred records of our community — minutes, attendance, and official communications. Your diligence ensures our parish history is faithfully preserved.",
      };
    case "TREASURER":
      return {
        title: "Steward of Resources",
        message:
          "As Treasurer, you oversee the financial gifts of the faithful. Your faithful stewardship ensures the parish's resources are used to glorify God and serve the community.",
      };
    case "MEMBERSHIP_COORDINATOR":
      return {
        title: "Welcoming Heart",
        message:
          "As Membership Coordinator, you are the first point of contact for those joining our community. Your warmth and organization help new members find their place in the Divine Mercy family.",
      };
    case "PUBLIC_RELATIONS_OFFICER":
      return {
        title: "Voice of the Parish",
        message:
          "As Public Relations Officer, you share the good news of our community with the world. Your efforts in communication and outreach help spread the message of Divine Mercy far and wide.",
      };
    case "MEMBER":
      return {
        title: "Beloved Parishioner",
        message:
          "Welcome to the Divine Mercy Seeta community portal. As a valued member, you can stay connected with parish life, events, and fellow parishioners. May your faith grow deeper each day.",
      };
  }
}
