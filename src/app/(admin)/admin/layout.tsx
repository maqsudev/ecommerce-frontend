"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  ShoppingBag,
  Users,
  MessageSquare,
  ShieldCheck,
  ExternalLink,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { ProtectedRoute } from "@/components/common/protected-route";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

const adminNav = [
  {
    name: "Dashboard & KPIs",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Ombor (Inventory)",
    href: "/admin/inventory",
    icon: Boxes,
  },
  {
    name: "Buyurtmalar boshqaruvi",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Mijozlar CRM",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Sharhlar moderatsiyasi",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
];

function AdminNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1.5 block">
        Boshqaruv
      </span>
      {adminNav.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all",
              isActive
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </div>
            {isActive && <ChevronRight className="h-3 w-3" />}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen flex bg-slate-100 text-slate-900">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col justify-between shrink-0 hidden md:flex border-r border-slate-800">
          <div>
            {/* Header */}
            <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/20">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight">
                    Admin Panel
                  </h2>
                  <span className="text-[10px] text-slate-400 font-mono">
                    v1.0 &bull; Enterprise
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation links inside Suspense */}
            <Suspense fallback={<div className="h-40 bg-slate-900/50 rounded-xl m-4 animate-pulse" />}>
              <AdminNavLinks />
            </Suspense>
          </div>

          {/* Bottom user / exit */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            <Link
              href="/"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="h-3.5 w-3.5" />
                Do&apos;konga o&apos;tish
              </span>
            </Link>

            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </aside>

        {/* Main Admin Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Boshqaruv paneli
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-[10px] text-indigo-600 font-semibold">
                  Administrator
                </p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold text-xs">
                {user?.first_name ? user.first_name[0].toUpperCase() : "A"}
              </div>
            </div>
          </header>

          {/* Page body */}
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
