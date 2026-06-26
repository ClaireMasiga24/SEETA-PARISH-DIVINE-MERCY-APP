"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Cross, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import BackgroundAmbience from "@/components/background-ambience";

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  ADMINISTRATOR: "/dashboard/administrator",
  PATRON: "/dashboard/patron",
  CHAIRPERSON: "/dashboard/chairperson",
  SECRETARY: "/dashboard/secretary",
  TREASURER: "/dashboard/treasurer",
  MEMBERSHIP_COORDINATOR: "/dashboard/membership-coordinator",
  PUBLIC_RELATIONS_OFFICER: "/dashboard/public-relations-officer",
  MEMBER: "/dashboard/member",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Show success message if redirected from initialization
  const justInitialized = searchParams.get("initialized") === "true";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both your email and password.");
      return;
    }

    setSubmitting(true);

    // Create an AbortController with a 20-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
        setSubmitting(false);
        return;
      }

      // Success — redirect to role-specific dashboard
      const dashboardPath = ROLE_DASHBOARD_MAP[data.user?.role] || "/";
      window.location.href = dashboardPath;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof DOMException && err.name === "AbortError") {
        setError(
          "The server is taking too long to respond. This can happen on the first request if the database is waking up. Please try again."
        );
      } else {
        setError(
          "Network error. Please check your connection and try again."
        );
      }
      setSubmitting(false);
    }
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
        {/* Sacred icon */}
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
            <LogIn className="h-7 w-7 text-gold-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-wide text-navy-800 sm:text-3xl">
            Enter the Sanctuary
          </h1>
          <p
            className="mt-2 max-w-xs text-sm leading-relaxed"
            style={{ color: "rgba(11, 19, 43, 0.5)" }}
          >
            Sign in with your parish account to access the community portal.
          </p>
        </div>

        {/* Success banner from initialization */}
        {justInitialized && (
          <div
            className="mb-6 rounded-lg border px-4 py-3 text-sm"
            style={{
              background: "rgba(45, 106, 79, 0.06)",
              borderColor: "rgba(45, 106, 79, 0.15)",
              color: "rgba(30, 80, 60, 0.9)",
            }}
          >
            The sanctuary has been consecrated! Sign in with your Administrator
            account to begin.
          </div>
        )}

        {/* Error banner */}
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

        {/* Form Card */}
        <div
          className="rounded-2xl border p-8"
          style={{
            background: "rgba(253, 252, 250, 0.85)",
            borderColor: "rgba(201, 168, 76, 0.15)",
            boxShadow:
              "0 4px 24px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
            backdropFilter: "blur(12px)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-medium tracking-wider uppercase"
                style={{ color: "rgba(11, 19, 43, 0.55)" }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-xs placeholder:tracking-wide"
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

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium tracking-wider uppercase"
                style={{ color: "rgba(11, 19, 43, 0.55)" }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition-all duration-200 placeholder:text-xs placeholder:tracking-wide"
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-navy-400 transition-colors hover:text-navy-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="-mt-1 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  router.push("/forgot-password");
                }}
                className="text-xs transition-colors hover:underline"
                style={{ color: "rgba(11, 19, 43, 0.4)" }}
              >
                Forgot password?
              </button>
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
                    Opening the gates...
                  </>
                ) : (
                  <>
                    <Cross className="h-4 w-4" />
                    Enter Sanctuary
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

          {/* Sacred divider */}
          <div className="sacred-divider mt-8">
            <span className="sacred-divider-icon">&#10013;</span>
          </div>
          <p
            className="mt-4 text-center text-xs italic leading-relaxed"
            style={{ color: "rgba(11, 19, 43, 0.4)" }}
          >
            Jesus, I Trust In You
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
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
              Opening the gates...
            </p>
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
