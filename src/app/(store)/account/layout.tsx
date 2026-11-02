"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, CreditCard, Bell, LogOut, ChevronRight } from "lucide-react";
import { ProtectedRoute } from "@/components/common/protected-route";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

const accountNavItems = [
  {
    label: "Mening profilim",
    href: "/account/profile",
    icon: User,
  },
  {
    label: "Buyurtmalar tarixi",
    href: "/account/orders",
    icon: Package,
  },
  {
    label: "Saqlangan kartalar",
    href: "/account/cards",
    icon: CreditCard,
  },
  {
    label: "Xabarnomalar",
    href: "/account/notifications",
    icon: Bell,
  },
];

function AccountNavLinks() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {accountNavItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive
                ? "bg-indigo-50 text-indigo-700 font-semibold shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-indigo-600" : "text-slate-400"
                )}
              />
              <span>{item.label}</span>
            </div>
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5",
                isActive ? "text-indigo-600" : "text-slate-300"
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Mening kabinetim
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Hisob ma&apos;lumotlari, xaridlar tarixi va to&apos;lov sozlamalarini boshqaring
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-6">
              {/* User overview */}
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-sm shadow-indigo-200">
                  {user?.first_name ? user.first_name[0].toUpperCase() : "U"}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {user?.first_name} {user?.last_name}
                  </h4>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Navigation links inside Suspense */}
              <Suspense fallback={<div className="h-40 bg-slate-50 rounded-xl animate-pulse" />}>
                <AccountNavLinks />
              </Suspense>

              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors mt-4"
              >
                <LogOut className="h-4 w-4 text-rose-500" />
                <span>Tizimdan chiqish</span>
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
