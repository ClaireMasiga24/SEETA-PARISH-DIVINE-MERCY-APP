import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/auth/check-init
 * Returns whether the system has been initialized.
 * Used by the client to determine which page to show.
 */
export async function GET() {
  try {
    const settings = await prisma.systemSettings.findFirst({
      where: { id: 1 },
    });

    return NextResponse.json({
      isInitialized: settings?.isInitialized ?? false,
    });
  } catch (error) {
    console.error("Check-init error:", error);
    return NextResponse.json(
      { error: "Failed to check initialization status" },
      { status: 500 }
    );
  }
}
