"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  ShieldOff,
  Trash2,
  Edit3,
  Loader2,
  Cross,
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

interface UsersListClientProps {
  users: UserData[];
  adminId: string;
  roleLabels: Record<string, string>;
}

export default function UsersListClient({ users, adminId, roleLabels }: UsersListClientProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleToggleActive(userId: string, currentlyActive: boolean) {
    setTogglingId(userId);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentlyActive }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update user");
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
      return;
    }
    setDeletingId(userId);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete user");
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      {error && (
        <div
          className="mb-4 rounded-lg border px-4 py-3 text-sm"
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
        className="overflow-hidden rounded-xl border"
        style={{
          background: "rgba(253, 252, 250, 0.85)",
          borderColor: "rgba(201, 168, 76, 0.15)",
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                className="border-b text-left text-xs font-medium uppercase tracking-wider"
                style={{
                  borderColor: "rgba(201, 168, 76, 0.12)",
                  color: "rgba(11, 19, 43, 0.4)",
                }}
              >
                <th className="px-5 py-3.5 font-medium">Name</th>
                <th className="px-5 py-3.5 font-medium">Email</th>
                <th className="px-5 py-3.5 font-medium">Role</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user.id}
                  className="border-b transition-colors hover:bg-gold-500/5"
                  style={{ borderColor: "rgba(201, 168, 76, 0.08)" }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold uppercase"
                        style={{
                          background:
                            user.role === "ADMINISTRATOR"
                              ? "rgba(201, 168, 76, 0.15)"
                              : "rgba(59, 86, 128, 0.1)",
                          color:
                            user.role === "ADMINISTRATOR"
                              ? "#C9A84C"
                              : "#3B5680",
                        }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-navy-800">
                          {user.name}
                          {user.id === adminId && (
                            <span className="ml-2 text-[10px] uppercase tracking-wider text-gold-500">
                              You
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4" style={{ color: "rgba(11, 19, 43, 0.6)" }}>
                    {user.email}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider"
                      style={{
                        background:
                          user.role === "ADMINISTRATOR"
                            ? "rgba(201, 168, 76, 0.12)"
                            : "rgba(59, 86, 128, 0.08)",
                        color:
                          user.role === "ADMINISTRATOR"
                            ? "rgba(180, 140, 60, 0.9)"
                            : "rgba(59, 86, 128, 0.8)",
                      }}
                    >
                      {(roleLabels[user.role] || user.role).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        user.isActive ? "text-green-700" : "text-red-600/60"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.isActive ? "bg-green-500" : "bg-red-400"
                        }`}
                      />
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* Toggle active */}
                      {user.id !== adminId && user.role !== "ADMINISTRATOR" && (
                        <button
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          disabled={togglingId === user.id}
                          className="rounded-lg p-2 text-navy-400 transition-colors hover:bg-navy-500/5 hover:text-navy-600 disabled:opacity-50"
                          title={user.isActive ? "Deactivate" : "Activate"}
                        >
                          {togglingId === user.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : user.isActive ? (
                            <ShieldOff className="h-3.5 w-3.5" />
                          ) : (
                            <Shield className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}

                      {/* Edit */}
                      {user.id !== adminId && (
                        <a
                          href={`/dashboard/administrator/users/${user.id}/edit`}
                          className="rounded-lg p-2 text-navy-400 transition-colors hover:bg-navy-500/5 hover:text-navy-600"
                          title="Edit user"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </a>
                      )}

                      {/* Delete */}
                      {user.id !== adminId && user.role !== "ADMINISTRATOR" && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deletingId === user.id}
                          className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/5 hover:text-red-600 disabled:opacity-50"
                          title="Delete user"
                        >
                          {deletingId === user.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="px-5 py-12 text-center">
            <Cross className="mx-auto mb-3 h-8 w-8 text-gold-500/40" />
            <p className="text-sm" style={{ color: "rgba(11, 19, 43, 0.4)" }}>
              No users found. Create your first user to get started.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
