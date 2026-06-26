import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDashboardPath } from "@/lib/roles";
import type { Role } from "@prisma/client";

/**
 * GET /api/auth/redirect
 *
 * Returns the role-appropriate dashboard redirect URL for the
 * currently authenticated user. Used by client-side login flows.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      redirect: getDashboardPath(session.role as Role),
    });
  } catch (error) {
    console.error("Auth redirect error:", error);
    return NextResponse.json(
      { error: "Failed to determine redirect" },
      { status: 500 }
    );
  }
}
