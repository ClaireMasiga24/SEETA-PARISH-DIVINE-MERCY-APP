"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Cross,
  LayoutDashboard,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Church,
  UserCheck,
  FileText,
  CreditCard,
  Megaphone,
} from "lucide-react";
import type { Role } from "@prisma/client";
import { ROLE_LABELS, ROLE_SLUGS } from "@/lib/roles";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

/**
 * Role-specific navigation items.
 */
function getNavItems(role: Role): NavItem[] {
  const base = `/dashboard/${ROLE_SLUGS[role]}`;
  const items: NavItem[] = [{ label: "Overview", href: base, icon: <LayoutDashboard className="h-4 w-4" /> }];

  if (role === "ADMINISTRATOR") {
    items.push({
      label: "Manage Users",
      href: `${base}/users`,
      icon: <Users className="h-4 w-4" />,
    });
  }

  return items;
}

/**
 * Get icon and color accent for sidebar header.
 */
function getRoleBadgeInfo(role: Role) {
  switch (role) {
    case "ADMINISTRATOR":
      return { bg: "rgba(201, 168, 76, 0.15)", text: "text-gold-500", icon: <Church className="h-5 w-5" /> };
    case "PATRON":
      return { bg: "rgba(59, 86, 128, 0.15)", text: "text-navy-400", icon: <UserCheck className="h-5 w-5" /> };
    case "CHAIRPERSON":
      return { bg: "rgba(201, 168, 76, 0.12)", text: "text-gold-500", icon: <UserCheck className="h-5 w-5" /> };
    case "SECRETARY":
      return { bg: "rgba(59, 86, 128, 0.12)", text: "text-navy-400", icon: <FileText className="h-5 w-5" /> };
    case "TREASURER":
      return { bg: "rgba(201, 168, 76, 0.12)", text: "text-gold-500", icon: <CreditCard className="h-5 w-5" /> };
    case "MEMBERSHIP_COORDINATOR":
      return { bg: "rgba(59, 86, 128, 0.12)", text: "text-navy-400", icon: <Users className="h-5 w-5" /> };
    case "PUBLIC_RELATIONS_OFFICER":
      return { bg: "rgba(201, 168, 76, 0.12)", text: "text-gold-500", icon: <Megaphone className="h-5 w-5" /> };
    case "MEMBER":
      return { bg: "rgba(59, 86, 128, 0.12)", text: "text-navy-400", icon: <UserCheck className="h-5 w-5" /> };
  }
}

export default function DashboardLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserData;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navItems = getNavItems(user.role);
  const badgeInfo = getRoleBadgeInfo(user.role);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close user menu on click outside
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = () => setUserMenuOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [userMenuOpen]);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Proceed anyway
    }
    router.replace("/");
  }, [router]);

  const isActive = (href: string) => {
    if (href === `/dashboard/${ROLE_SLUGS[user.role]}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-[#EBE3DB]">
      {/* ── Sidebar overlay (mobile) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "rgba(253, 252, 250, 0.95)",
          borderColor: "rgba(201, 168, 76, 0.15)",
        }}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "rgba(201, 168, 76, 0.12)" }}>
          <a href="/" className="flex items-center gap-2">
            <Cross className="h-4 w-4 text-gold-500" />
            <span className="font-heading text-sm font-semibold tracking-wider text-navy-800">
              DIVINE MERCY
            </span>
          </a>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-navy-400 hover:text-navy-600 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Role badge */}
        <div className="border-b px-5 py-3" style={{ borderColor: "rgba(201, 168, 76, 0.08)" }}>
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: badgeInfo.bg }}
            >
              <span className={badgeInfo.text}>{badgeInfo.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-navy-800">
                {user.name}
              </p>
              <p className="truncate text-[10px] uppercase tracking-wider" style={{ color: "rgba(11, 19, 43, 0.4)" }}>
                {ROLE_LABELS[user.role]}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-gold-500/10 text-gold-600"
                      : "text-navy-500 hover:bg-navy-500/5 hover:text-navy-700"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar footer — logout */}
        <div className="border-t px-3 py-3" style={{ borderColor: "rgba(201, 168, 76, 0.12)" }}>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600/70 transition-all duration-200 hover:bg-red-500/5 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header
          className="flex items-center justify-between border-b px-4 py-3 md:hidden"
          style={{
            background: "rgba(253, 252, 250, 0.9)",
            borderColor: "rgba(201, 168, 76, 0.12)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-navy-500 hover:text-navy-700"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Cross className="h-3.5 w-3.5 text-gold-500" />
            <span className="font-heading text-xs font-semibold tracking-wider text-navy-800">
              DIVINE MERCY
            </span>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserMenuOpen(!userMenuOpen);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{ background: badgeInfo.bg }}
              aria-label="User menu"
            >
              <span className={badgeInfo.text}>
                <ChevronDown className="h-3.5 w-3.5" />
              </span>
            </button>
            {userMenuOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-48 rounded-xl border p-1 shadow-lg"
                style={{
                  background: "rgba(253, 252, 250, 0.98)",
                  borderColor: "rgba(201, 168, 76, 0.15)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="border-b px-3 py-2" style={{ borderColor: "rgba(201, 168, 76, 0.1)" }}>
                  <p className="text-xs font-medium text-navy-800 truncate">{user.name}</p>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(11, 19, 43, 0.4)" }}>
                    {ROLE_LABELS[user.role]}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-600/70 hover:bg-red-500/5 hover:text-red-600"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>

        {/* Footer */}
        <footer
          className="border-t px-4 py-3 text-center text-[10px] uppercase tracking-widest md:px-8"
          style={{
            borderColor: "rgba(201, 168, 76, 0.1)",
            color: "rgba(11, 19, 43, 0.3)",
          }}
        >
          Jesus, I Trust In You &mdash; Divine Mercy Seeta Parish
        </footer>
      </div>
    </div>
  );
}
