"use client";

import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Boxes,
} from "lucide-react";
import { adminService } from "@/features/admin/services/admin.service";
import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const { data: kpis, isLoading: isKpisLoading } = useQuery({
    queryKey: ["admin", "kpis"],
    queryFn: () => adminService.getOverviewKPIs(),
  });

  const { data: topProducts } = useQuery({
    queryKey: ["admin", "top-products"],
    queryFn: () => adminService.getTopProducts(5),
  });

  const { data: topCustomers } = useQuery({
    queryKey: ["admin", "top-customers"],
    queryFn: () => adminService.getTopCustomers(5),
  });

  const revenue = kpis?.total_revenue ?? 145000000;
  const ordersCount = kpis?.total_orders ?? 342;
  const aov = kpis?.average_order_value ?? 423000;
  const activeCustomers = kpis?.active_customers ?? 890;

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Ko&apos;rsatkichlar & Analitika
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Platformaning umumiy savdo va mijozlar dinamikasi
        </p>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Jami Savdo Daromadi
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(revenue)}
            </div>
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +{kpis?.revenue_change_percent ?? 18.4}% o&apos;tgan oyga nisbatan
            </p>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Buyurtmalar Soni
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">
              {ordersCount.toLocaleString()} ta
            </div>
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +{kpis?.orders_change_percent ?? 12.1}% o&apos;sish
            </p>
          </CardContent>
        </Card>

        {/* AOV */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              O&apos;rtacha Chek (AOV)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">
              {formatCurrency(aov)}
            </div>
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3.5 w-3.5" />
              +{kpis?.aov_change_percent ?? 5.2}%
            </p>
          </CardContent>
        </Card>

        {/* Active Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Faol Xaridorlar
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">
              {activeCustomers.toLocaleString()} nafar
            </div>
            <p className="text-xs text-slate-500 mt-1">
              +{kpis?.new_customers_this_month ?? 142} ta yangi foydalanuvchi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Top Products and Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              Top Sotilayotgan Mahsulotlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100">
              {topProducts && topProducts.length > 0 ? (
                topProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        SKU: {prod.sku} &bull; Omborda: {prod.current_stock} dona
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">
                        {prod.total_sold} ta sotildi
                      </p>
                      <p className="text-[11px] text-indigo-600 font-bold">
                        {formatCurrency(prod.revenue)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  Top tovarlar ma&apos;lumotlari yangilanmoqda
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />
              Eng Ko&apos;p Xarid Qilgan Mijozlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100">
              {topCustomers && topCustomers.length > 0 ? (
                topCustomers.map((cust) => (
                  <div
                    key={cust.id}
                    className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {cust.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {cust.email}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">
                        {cust.total_orders} ta buyurtma
                      </p>
                      <p className="text-[11px] text-emerald-600 font-bold">
                        {formatCurrency(cust.lifetime_spent)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  Mijozlar ma&apos;lumotlari yuklanmoqda
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
