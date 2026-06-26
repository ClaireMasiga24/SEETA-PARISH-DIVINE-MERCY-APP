import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { z } from "zod/v4";

const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum([
    "ADMINISTRATOR",
    "PATRON",
    "CHAIRPERSON",
    "SECRETARY",
    "TREASURER",
    "MEMBERSHIP_COORDINATOR",
    "PUBLIC_RELATIONS_OFFICER",
    "MEMBER",
  ]),
});

/**
 * GET /api/admin/users
 *
 * Returns all users (with password excluded).
 * ADMINISTRATOR only.
 */
export async function GET() {
  try {
    await requireRole(["ADMINISTRATOR"]);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Admin list users error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve users" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 *
 * Creates a new user with the specified role.
 * ADMINISTRATOR only. Never allows creating another ADMINISTRATOR.
 */
export async function POST(request: Request) {
  try {
    await requireRole(["ADMINISTRATOR"]);

    const body = await request.json();
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    // Only the first admin can be ADMINISTRATOR — prevent creating more
    if (role === "ADMINISTRATOR") {
      return NextResponse.json(
        { error: "Cannot create additional Administrator accounts. Only the initial system Administrator exists." },
        { status: 403 }
      );
    }

	    // Check email uniqueness
	    const existing = await prisma.user.findUnique({ where: { email } });
	    if (existing) {
	      return NextResponse.json(
	        { error: "A user with this email already exists" },
	        { status: 409 }
	      );
	    }

	    // 1. Create user in Supabase Auth first
	    const { data: authData, error: authError } =
	      await supabaseAdmin.auth.admin.createUser({
	        email,
	        password,
	        email_confirm: true,
	      });

	    if (authError) {
	      console.error("Supabase Auth create user error:", authError);
	      return NextResponse.json(
	        { error: `Failed to create user in Supabase: ${authError.message}` },
	        { status: 500 }
	      );
	    }

	    const supabaseUserId = authData.user.id;

	    try {
	      // 2. Create user in the local database
	      const hashedPassword = await hashPassword(password);

	      const user = await prisma.user.create({
	        data: {
	          name,
	          email,
	          password: hashedPassword,
	          role,
	          isActive: true,
	          supabaseId: supabaseUserId,
	        },
	        select: {
	          id: true,
	          name: true,
	          email: true,
	          role: true,
	          isActive: true,
	          createdAt: true,
	        },
	      });

	      return NextResponse.json({ user }, { status: 201 });
	    } catch (dbError) {
	      // DB save failed — rollback: delete the Supabase Auth user
	      console.error("Database create user error, rolling back Supabase Auth:", dbError);
	      await supabaseAdmin.auth.admin.deleteUser(supabaseUserId);
	      return NextResponse.json(
	        { error: "Failed to create user in database. Supabase Auth user has been rolled back." },
	        { status: 500 }
	      );
	    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Admin create user error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
