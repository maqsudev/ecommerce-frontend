"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Clock, ArrowRight, XCircle, ShoppingBag } from "lucide-react";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/types/orders";

export default function CustomerOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const { data: ordersData, isLoading } = useOrders(
    selectedStatus ? { status: selectedStatus } : {}
  );

  const orders = ordersData?.results || [];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="warning">Kutilmoqda</Badge>;
      case "CONFIRMED":
        return <Badge variant="default">Tasdiqlandi</Badge>;
      case "PROCESSING":
        return <Badge variant="default">Yig&apos;ilmoqda</Badge>;
      case "SHIPPED":
        return <Badge variant="secondary">Yetkazilmoqda</Badge>;
      case "DELIVERED":
        return <Badge variant="success">Yetkazildi</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">Bekor qilingan</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Buyurtmalar tarixi</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Barcha xaridlaringiz va ularning holati
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {[
            { label: "Barchasi", value: "" },
            { label: "Kutilmoqda", value: "PENDING" },
            { label: "Tasdiqlangan", value: "CONFIRMED" },
            { label: "Yo'lda", value: "SHIPPED" },
            { label: "Yetkazildi", value: "DELIVERED" },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedStatus === tab.value
                  ? "bg-indigo-600 text-white font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-white border border-slate-100 p-6 animate-pulse"
            />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-slate-900">
                    #{order.order_number}
                  </span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatDate(order.created_at)}</span>
                </div>
              </div>

              {/* Items summary */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2 overflow-hidden">
                    {order.items?.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="inline-block h-10 w-10 rounded-xl ring-2 ring-white bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <ShoppingBag className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      {order.items?.[0]?.product_name}
                      {order.items?.length > 1 && (
                        <span className="text-slate-400">
                          {" "}
                          va yana {order.items.length - 1} ta tovar
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      To&apos;lov turi: {order.payment_method}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Jami summa:</p>
                    <p className="text-base font-black text-indigo-600">
                      {formatCurrency(order.total_amount)}
                    </p>
                  </div>

                  <Link href={`/account/orders/${order.order_number}`}>
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <span>Kuzatish</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
          <Package className="h-10 w-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            Buyurtmalar topilmadi
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Ushbu bo&apos;limda hali hech qanday xarid amalga oshirilmagan
          </p>
        </div>
      )}
    </div>
  );
}
