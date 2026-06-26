"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import BackgroundAmbience from "@/components/background-ambience";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Supabase automatically processes the #access_token from the URL hash
    // and sets the session. We check if a session is present.
    supabase.auth.getSession().then(({ data, error: sessionErr }) => {
      if (sessionErr || !data.session) {
        setSessionError(true);
      } else {
        setSessionReady(true);
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors: Record<string, string[]> = {};
    if (!password || password.length < 8) {
      errors.password = ["Password must be at least 8 characters"];
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = ["Must contain uppercase, lowercase, and a number"];
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = ["Passwords do not match"];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setSubmitting(false);

    if (updateError) {
      setError("Link expired or invalid. Please try again.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  // Loading state while Supabase processes the recovery token
  if (!sessionReady && !sessionError) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-[#EBE3DB]">
        <BackgroundAmbience />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div
            className="h-12 w-12 animate-spin rounded-full border-2 border-t-transparent"
            style={{
              borderColor: "rgba(201, 168, 76, 0.3)",
              borderTopColor: "#C9A84C",
            }}
          />
          <p className="font-heading text-sm tracking-wider text-navy-500">
            Verifying reset link...
          </p>
        </div>
      </main>
    );
  }

  // Invalid / expired link
  if (sessionError) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#EBE3DB]">
        <BackgroundAmbience />
        <div
          className="relative z-10 mx-auto w-full max-w-md rounded-xl border p-8 text-center"
          style={{
            background: "rgba(253, 252, 250, 0.85)",
            borderColor: "rgba(201, 168, 76, 0.15)",
          }}
        >
          <KeyRound className="mx-auto mb-4 h-10 w-10 text-gold-500/60" />
          <h1 className="font-heading text-xl font-bold text-navy-800">
            Invalid Reset Link
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: "rgba(11, 19, 43, 0.5)" }}
          >
            Link expired or invalid. Please request a new one.
          </p>
          <a
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-navy-900 transition-all"
            style={{
              background: "linear-gradient(135deg, #E8C462, #C9A84C)",
            }}
          >
            Back to Login
          </a>
        </div>
      </main>
    );
  }

  // Success state
  if (success) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#EBE3DB]">
        <BackgroundAmbience />
        <div
          className="relative z-10 mx-auto w-full max-w-md rounded-xl border p-8 text-center"
          style={{
            background: "rgba(253, 252, 250, 0.85)",
            borderColor: "rgba(201, 168, 76, 0.15)",
          }}
        >
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
            style={{ background: "rgba(45, 106, 79, 0.08)" }}
          >
            <KeyRound className="h-6 w-6 text-green-700" />
          </div>
          <h1 className="font-heading text-xl font-bold text-navy-800">
            Password updated!
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: "rgba(11, 19, 43, 0.5)" }}
          >
            Your password has been changed. Redirecting to sign in...
          </p>
        </div>
      </main>
    );
  }

  // Password reset form
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
            <KeyRound className="h-7 w-7 text-gold-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-wide text-navy-800 sm:text-3xl">
            Reset Your Password
          </h1>
          <p
            className="mt-2 max-w-xs text-sm leading-relaxed"
            style={{ color: "rgba(11, 19, 43, 0.5)" }}
          >
            Enter your new password below.
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
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium tracking-wider uppercase"
                style={{ color: "rgba(11, 19, 43, 0.55)" }}
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition-all duration-200 placeholder:text-xs"
                  style={{
                    background: "rgba(253, 252, 250, 0.9)",
                    borderColor: fieldErrors.password
                      ? "rgba(220, 38, 38, 0.4)"
                      : "rgba(201, 168, 76, 0.15)",
                    color: "#0B132B",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#C9A84C";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(201, 168, 76, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = fieldErrors.password
                      ? "rgba(220, 38, 38, 0.4)"
                      : "rgba(201, 168, 76, 0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.password[0]}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-xs font-medium tracking-wider uppercase"
                style={{ color: "rgba(11, 19, 43, 0.55)" }}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition-all duration-200 placeholder:text-xs"
                  style={{
                    background: "rgba(253, 252, 250, 0.9)",
                    borderColor: fieldErrors.confirmPassword
                      ? "rgba(220, 38, 38, 0.4)"
                      : "rgba(201, 168, 76, 0.15)",
                    color: "#0B132B",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#C9A84C";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(201, 168, 76, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = fieldErrors.confirmPassword
                      ? "rgba(220, 38, 38, 0.4)"
                      : "rgba(201, 168, 76, 0.15)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                  tabIndex={-1}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.confirmPassword[0]}
                </p>
              )}
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
                    Changing...
                  </>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    Change Password
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
        </div>
      </div>
    </main>
  );
}
