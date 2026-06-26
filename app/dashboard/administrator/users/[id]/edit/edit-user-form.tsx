"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Cross } from "lucide-react";

const ROLES = [
  { value: "PATRON", label: "Patron" },
  { value: "CHAIRPERSON", label: "Chairperson" },
  { value: "SECRETARY", label: "Secretary" },
  { value: "TREASURER", label: "Treasurer" },
  { value: "MEMBERSHIP_COORDINATOR", label: "Membership Coordinator" },
  { value: "PUBLIC_RELATIONS_OFFICER", label: "Public Relations Officer" },
  { value: "MEMBER", label: "Member" },
] as const;

interface EditUserFormProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
  };
}

export default function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.isActive);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors: Record<string, string[]> = {};
    if (!name || name.length < 2) errors.name = ["Name must be at least 2 characters"];
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = ["Please enter a valid email address"];
    if (password && password.length < 8)
      errors.password = ["Password must be at least 8 characters"];
    else if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      errors.password = ["Must contain uppercase, lowercase, and a number"];

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSubmitting(true);

    const body: Record<string, unknown> = { name, email, role, isActive };
    if (password) body.password = password;

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        } else {
          setError(data.error || "Failed to update user");
        }
        setSubmitting(false);
        return;
      }

      router.push("/dashboard/administrator/users");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div
      className="rounded-xl border p-6 sm:p-8"
      style={{
        background: "rgba(253, 252, 250, 0.85)",
        borderColor: "rgba(201, 168, 76, 0.15)",
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
        {/* Name */}
        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-wider uppercase" style={{ color: "rgba(11, 19, 43, 0.55)" }}>
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              background: "rgba(253, 252, 250, 0.9)",
              borderColor: fieldErrors.name ? "rgba(220, 38, 38, 0.4)" : "rgba(201, 168, 76, 0.15)",
              color: "#0B132B",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#C9A84C"; e.target.style.boxShadow = "0 0 0 3px rgba(201, 168, 76, 0.1)"; }}
            onBlur={(e) => { e.target.style.borderColor = fieldErrors.name ? "rgba(220, 38, 38, 0.4)" : "rgba(201, 168, 76, 0.15)"; e.target.style.boxShadow = "none"; }}
          />
          {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name[0]}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-wider uppercase" style={{ color: "rgba(11, 19, 43, 0.55)" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              background: "rgba(253, 252, 250, 0.9)",
              borderColor: fieldErrors.email ? "rgba(220, 38, 38, 0.4)" : "rgba(201, 168, 76, 0.15)",
              color: "#0B132B",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#C9A84C"; e.target.style.boxShadow = "0 0 0 3px rgba(201, 168, 76, 0.1)"; }}
            onBlur={(e) => { e.target.style.borderColor = fieldErrors.email ? "rgba(220, 38, 38, 0.4)" : "rgba(201, 168, 76, 0.15)"; e.target.style.boxShadow = "none"; }}
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email[0]}</p>}
        </div>

        {/* Password (optional — leave blank to keep current) */}
        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-wider uppercase" style={{ color: "rgba(11, 19, 43, 0.55)" }}>
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition-all duration-200 placeholder:text-xs"
              style={{
                background: "rgba(253, 252, 250, 0.9)",
                borderColor: fieldErrors.password ? "rgba(220, 38, 38, 0.4)" : "rgba(201, 168, 76, 0.15)",
                color: "#0B132B",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#C9A84C"; e.target.style.boxShadow = "0 0 0 3px rgba(201, 168, 76, 0.1)"; }}
              onBlur={(e) => { e.target.style.borderColor = fieldErrors.password ? "rgba(220, 38, 38, 0.4)" : "rgba(201, 168, 76, 0.15)"; e.target.style.boxShadow = "none"; }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 right-3 -translate-y-1/2 text-navy-400 hover:text-navy-600" tabIndex={-1}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password[0]}</p>}
        </div>

        {/* Role */}
        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-wider uppercase" style={{ color: "rgba(11, 19, 43, 0.55)" }}>
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              background: "rgba(253, 252, 250, 0.9)",
              borderColor: "rgba(201, 168, 76, 0.15)",
              color: "#0B132B",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#C9A84C"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(201, 168, 76, 0.15)"; }}
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="mb-1.5 block text-xs font-medium tracking-wider uppercase" style={{ color: "rgba(11, 19, 43, 0.55)" }}>
            Account Status
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "rgba(11, 19, 43, 0.6)" }}>
              <input
                type="radio"
                name="isActive"
                checked={isActive === true}
                onChange={() => setIsActive(true)}
                className="accent-gold-500"
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "rgba(11, 19, 43, 0.6)" }}>
              <input
                type="radio"
                name="isActive"
                checked={isActive === false}
                onChange={() => setIsActive(false)}
                className="accent-gold-500"
              />
              Inactive
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold tracking-wide text-navy-900 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #E8C462, #C9A84C)",
              boxShadow: "0 4px 16px rgba(201, 168, 76, 0.3)",
            }}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Cross className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
          <a
            href="/dashboard/administrator/users"
            className="rounded-xl px-6 py-3 text-sm font-medium transition-colors"
            style={{ color: "rgba(11, 19, 43, 0.5)" }}
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
