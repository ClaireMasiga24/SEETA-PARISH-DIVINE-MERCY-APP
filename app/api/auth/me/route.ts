import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated user's profile.
 * Used by client components to verify session state.
 */
export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve user" },
      { status: 500 }
    );
  }
}
