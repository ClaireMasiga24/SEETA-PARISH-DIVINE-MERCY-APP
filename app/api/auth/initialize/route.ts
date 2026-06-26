import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { initializeSchema } from "@/lib/validations";
import { sendWelcomeEmail } from "@/lib/email";

/**
 * POST /api/auth/initialize
 *
 * Initializes the system by:
 * 1. Validating the request body
 * 2. Checking the system hasn't been initialized yet
 * 3. Creating the first user with ADMINISTRATOR role
 * 4. Creating the SystemSettings record with isInitialized = true
 * 5. Sending a welcome email via Resend
 * 6. Creating a session for the new administrator
 */
export async function POST(request: Request) {
  try {
    // 1. Validate input
    const body = await request.json();
    const parsed = initializeSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // 2. Check system is not already initialized
    const existingSettings = await prisma.systemSettings.findFirst({
      where: { id: 1 },
    });

    if (existingSettings?.isInitialized) {
      return NextResponse.json(
        { error: "System has already been initialized" },
        { status: 409 }
      );
    }

    // 3. Check no admin user already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMINISTRATOR" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "An administrator account already exists" },
        { status: 409 }
      );
    }

    // 4. Check email is not already taken
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    // 5. Hash password and create administrator
    const hashedPassword = await hashPassword(password);

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMINISTRATOR",
        isActive: true,
      },
    });

    // 6. Create or update SystemSettings
    await prisma.systemSettings.upsert({
      where: { id: 1 },
      create: { id: 1, isInitialized: true },
      update: { isInitialized: true },
    });

    // 7. Send welcome email (non-blocking — fire-and-forget)
    sendWelcomeEmail({ name, email }).catch((err) => {
      console.error("Welcome email failed (non-blocking):", err);
    });

    // 8. Create session for the new admin
    const token = await createSessionToken({
      userId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: "System initialized successfully",
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Initialize error:", error);
    return NextResponse.json(
      { error: "Failed to initialize system. Please try again." },
      { status: 500 }
    );
  }
}
