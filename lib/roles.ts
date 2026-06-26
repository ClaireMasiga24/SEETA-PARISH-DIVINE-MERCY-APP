import type { Role } from "@prisma/client";

/**
 * All supported roles in the system.
 */
export const ALL_ROLES: Role[] = [
  "ADMINISTRATOR",
  "PATRON",
  "CHAIRPERSON",
  "SECRETARY",
  "TREASURER",
  "MEMBERSHIP_COORDINATOR",
  "PUBLIC_RELATIONS_OFFICER",
  "MEMBER",
];

/**
 * Human-readable display labels for each role.
 */
export const ROLE_LABELS: Record<Role, string> = {
  ADMINISTRATOR: "Administrator",
  PATRON: "Patron",
  CHAIRPERSON: "Chairperson",
  SECRETARY: "Secretary",
  TREASURER: "Treasurer",
  MEMBERSHIP_COORDINATOR: "Membership Coordinator",
  PUBLIC_RELATIONS_OFFICER: "Public Relations Officer",
  MEMBER: "Member",
};

/**
 * URL-friendly slug for each role (used in route paths).
 */
export const ROLE_SLUGS: Record<Role, string> = {
  ADMINISTRATOR: "administrator",
  PATRON: "patron",
  CHAIRPERSON: "chairperson",
  SECRETARY: "secretary",
  TREASURER: "treasurer",
  MEMBERSHIP_COORDINATOR: "membership-coordinator",
  PUBLIC_RELATIONS_OFFICER: "public-relations-officer",
  MEMBER: "member",
};

/**
 * Reverse mapping: URL slug → Role enum value.
 */
export const SLUG_TO_ROLE: Record<string, Role> = Object.fromEntries(
  ALL_ROLES.map((role) => [ROLE_SLUGS[role], role])
);

/**
 * Get the dashboard path for a given role.
 */
export function getDashboardPath(role: Role): string {
  return `/dashboard/${ROLE_SLUGS[role]}`;
}

/**
 * Get the dashboard path from a URL slug.
 */
export function getDashboardPathFromSlug(slug: string): string | null {
  const role = SLUG_TO_ROLE[slug];
  if (!role) return null;
  return getDashboardPath(role);
}

/**
 * Role hierarchy — roles listed in descending authority.
 * Higher-index roles have more privileges conceptually,
 * but the ADMINISTRATOR is the only role with user management rights.
 */
export const ROLE_HIERARCHY: Role[] = [
  "MEMBER",
  "PUBLIC_RELATIONS_OFFICER",
  "MEMBERSHIP_COORDINATOR",
  "TREASURER",
  "SECRETARY",
  "CHAIRPERSON",
  "PATRON",
  "ADMINISTRATOR",
];

/**
 * Descriptive suffix for dashboard page titles.
 */
export const ROLE_TITLE_SUFFIX: Record<Role, string> = {
  ADMINISTRATOR: "Administrator Dashboard",
  PATRON: "Patron Dashboard",
  CHAIRPERSON: "Chairperson Dashboard",
  SECRETARY: "Secretary Dashboard",
  TREASURER: "Treasurer Dashboard",
  MEMBERSHIP_COORDINATOR: "Membership Coordinator Dashboard",
  PUBLIC_RELATIONS_OFFICER: "Public Relations Dashboard",
  MEMBER: "Member Dashboard",
};
