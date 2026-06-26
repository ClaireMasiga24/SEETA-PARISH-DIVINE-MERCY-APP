import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod/v4";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "divine-mercy-seeta-parish-jwt-secret-key-2024"
);

const forgotSchema = z.object({
  email: z.string().email(),
});

/**
 * POST /api/auth/forgot-password
 *
 * Accepts an email, generates a password reset token (15-minute expiry),
 * and sends a reset link via email.
 *
 * If the email cannot be delivered (e.g. Resend not configured), the
 * response includes a fallback link so the user can still reset their password.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Look up the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    let resetLink: string | null = null;
    let emailSent = false;

    if (user) {
      const resetToken = await new SignJWT({
        userId: user.id,
        email: user.email,
        purpose: "password-reset",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m")
        .sign(JWT_SECRET);

      const origin = new URL(request.url).origin;
      resetLink = `${origin}/reset-password?token=${resetToken}`;

      // Try to send the email
      try {
        await sendPasswordResetEmail({
          name: user.name,
          email: user.email,
          resetLink,
        });
        emailSent = true;
      } catch (err) {
        console.error("Password reset email failed:", err);
        // Fall through — will return the link as fallback
      }
    }

    return NextResponse.json({
      success: true,
      message: emailSent
        ? "If an account with that email exists, a password reset link has been sent."
        : "A reset link has been generated. Use it below to reset your password.",
      // Return the link as a fallback so the UI can display it
      // when the email couldn't be delivered
      resetLink: resetLink,
      emailSent: emailSent,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
