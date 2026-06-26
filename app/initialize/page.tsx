"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cross, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import BackgroundAmbience from "@/components/background-ambience";

export default function InitializePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function checkInit() {
      try {
        const res = await fetch("/api/auth/check-init");
        const data = await res.json();
        if (data.isInitialized) {
          router.replace("/login");
        }
      } catch {
        // If the check fails, stay on this page
      } finally {
        setChecking(false);
      }
    }
    checkInit();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Client-side validation
    const errors: Record<string, string[]> = {};

    if (!name || name.length < 2) {
      errors.name = ["Full name must be at least 2 characters"];
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = ["Please enter a valid email address"];
    }

    if (!password || password.length < 8) {
      errors.password = ["Password must be at least 8 characters"];
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = [
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ];
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = ["Passwords do not match"];
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        } else {
          setError(data.error || "Failed to initialize system");
        }
        setSubmitting(false);
        return;
      }

      // Success — redirect to the administrator dashboard
      router.replace("/dashboard/administrator");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (checking) {
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
            Preparing the sanctuary...
          </p>
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

      <div className="relative z-10 mx-auto w-full max-w-lg px-6 py-12">
        {/* Sacred icon */}
        <div className="mx-auto mb-8 flex flex-col items-center text-center">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(212, 175, 55, 0.08))",
              boxShadow: "0 0 0 2px rgba(201, 168, 76, 0.2), 0 8px 32px rgba(201, 168, 76, 0.1)",
            }}
          >
            <ShieldCheck className="h-7 w-7 text-gold-500" />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-wide text-navy-800 sm:text-3xl">
            Initialize the Sanctuary
          </h1>
          <p
            className="mt-2 max-w-sm text-sm leading-relaxed"
            style={{ color: "rgba(11, 19, 43, 0.5)" }}
          >
            Establish the foundation of your parish system. You will be granted
            the Administrator role to oversee the community.
          </p>
        </div>

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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-medium tracking-wider uppercase"
                style={{ color: "rgba(11, 19, 43, 0.55)" }}
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fr. John Mugisha"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-xs placeholder:tracking-wide"
                style={{
                  background: "rgba(253, 252, 250, 0.9)",
                  borderColor: fieldErrors.name
                    ? "rgba(220, 38, 38, 0.4)"
                    : "rgba(201, 168, 76, 0.15)",
                  color: "#0B132B",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#C9A84C";
                  e.target.style.boxShadow = "0 0 0 3px rgba(201, 168, 76, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = fieldErrors.name
                    ? "rgba(220, 38, 38, 0.4)"
                    : "rgba(201, 168, 76, 0.15)";
                  e.target.style.boxShadow = "none";
                }}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.name[0]}
                </p>
              )}
            </div>

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
                placeholder="admin@divinemercyseeta.org"
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-xs placeholder:tracking-wide"
                style={{
                  background: "rgba(253, 252, 250, 0.9)",
                  borderColor: fieldErrors.email
                    ? "rgba(220, 38, 38, 0.4)"
                    : "rgba(201, 168, 76, 0.15)",
                  color: "#0B132B",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#C9A84C";
                  e.target.style.boxShadow = "0 0 0 3px rgba(201, 168, 76, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = fieldErrors.email
                    ? "rgba(220, 38, 38, 0.4)"
                    : "rgba(201, 168, 76, 0.15)";
                  e.target.style.boxShadow = "none";
                }}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {fieldErrors.email[0]}
                </p>
              )}
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
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition-all duration-200 placeholder:text-xs placeholder:tracking-wide"
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
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition-all duration-200 placeholder:text-xs placeholder:tracking-wide"
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
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-navy-400 transition-colors hover:text-navy-600"
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
                    Initializing...
                  </>
                ) : (
                  <>
                    <Cross className="h-4 w-4" />
                    Consecrate the Sanctuary
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
