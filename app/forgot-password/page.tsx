"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import BackgroundAmbience from "@/components/background-ambience";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    setSubmitting(false);

    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#EBE3DB]">
        <BackgroundAmbience />
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(201, 168, 76, 0.3) 15%, rgba(212, 175, 55, 0.6) 30%, rgba(232, 196, 98, 0.8) 50%, rgba(212, 175, 55, 0.6) 70%, rgba(201, 168, 76, 0.3) 85%, transparent 100%)",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-md px-6 py-12">
          <div
            className="rounded-2xl border p-8 text-center"
            style={{
              background: "rgba(253, 252, 250, 0.85)",
              borderColor: "rgba(201, 168, 76, 0.15)",
            }}
          >
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "rgba(45, 106, 79, 0.08)" }}
            >
              <Mail className="h-6 w-6 text-green-700" />
            </div>
            <h2 className="font-heading text-lg font-semibold text-navy-800">
              Check your email for a reset link
            </h2>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "rgba(11, 19, 43, 0.5)" }}
            >
              We&apos;ve sent a password reset link to{" "}
              <span className="font-medium text-navy-700">{email}</span>. Please
              check your inbox and follow the instructions.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-navy-900 transition-all"
              style={{
                background: "linear-gradient(135deg, #E8C462, #C9A84C)",
              }}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#EBE3DB]">
      <BackgroundAmbience />

      {/* Top ornamental border */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(201, 168, 76, 0.3) 15%, rgba(212, 175, 55, 0.6) 30%, rgba(232, 196, 98, 0.8) 50%, rgba(212, 175, 55, 0.6) 70%, rgba(201, 168, 76, 0.3) 85%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-md px-6 py-12">
        <div className="mx-auto mb-8 flex flex-col items-center text-center">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(212, 175, 55, 0.08))",
              boxShadow:
                "0 0 0 2px rgba(201, 168, 76, 0.2), 0 8px 32px rgba(201, 168, 76, 0.1)",
            }}
          >
            <Mail className="h-7 w-7 text-gold-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-wide text-navy-800 sm:text-3xl">
            Forgot Password
          </h1>
          <p
            className="mt-2 max-w-xs text-sm leading-relaxed"
            style={{ color: "rgba(11, 19, 43, 0.5)" }}
          >
            Enter the email address associated with your parish account and
            we&apos;ll send you a reset link.
          </p>
        </div>

        {error && (
          <div
            className="mb-6 rounded-lg border px-4 py-3 text-sm"
            style={{
              background: "rgba(220, 38, 38, 0.06)",
              borderColor: "rgba(220, 38, 38, 0.15)",
              color: "rgba(185, 28, 28, 0.85)",
            }}
          >
            {error}
          </div>
        )}

        <div
          className="rounded-2xl border p-8"
          style={{
            background: "rgba(253, 252, 250, 0.85)",
            borderColor: "rgba(201, 168, 76, 0.15)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="forgotEmail"
                className="mb-1.5 block text-xs font-medium tracking-wider uppercase"
                style={{ color: "rgba(11, 19, 43, 0.55)" }}
              >
                Email Address
              </label>
              <input
                id="forgotEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-xs"
                style={{
                  background: "rgba(253, 252, 250, 0.9)",
                  borderColor: "rgba(201, 168, 76, 0.15)",
                  color: "#0B132B",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#C9A84C";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(201, 168, 76, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(201, 168, 76, 0.15)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="group relative mt-2 inline-flex w-full items-center justify-center overflow-hidden rounded-xl px-6 py-3.5 text-sm font-semibold tracking-wide text-navy-900 transition-all duration-500 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #E8C462, #C9A84C)",
                boxShadow: "0 4px 20px rgba(201, 168, 76, 0.3)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    Send Reset Link
                  </>
                )}
              </span>
              <span
                className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(135deg, #D4AF37, #E8C462)",
                }}
              />
            </button>
          </form>

          <div className="sacred-divider mt-8">
            <span className="sacred-divider-icon">&#10013;</span>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 flex w-full items-center justify-center gap-1.5 text-center text-xs font-medium uppercase tracking-wider transition-colors hover:underline"
            style={{ color: "rgba(11, 19, 43, 0.4)" }}
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Sign In
          </button>
        </div>
      </div>
    </main>
  );
}
