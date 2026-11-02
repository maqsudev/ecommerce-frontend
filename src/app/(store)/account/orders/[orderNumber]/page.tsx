"use client";

import { use, useState, Suspense } from "react";
import Link from "next/link";
import {
  Package,
  Clock,
  MapPin,
  Printer,
  XCircle,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Truck,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import {
  useOrderDetail,
  useOrderTracking,
  useOrderInvoice,
} from "@/features/orders/hooks/useOrders";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ordersService } from "@/features/orders/services/orders.service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

function OrderDetailContent({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const resolvedParams = use(params);
  const orderNumber = resolvedParams.orderNumber;
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useOrderDetail(orderNumber);
  const { data: tracking } = useOrderTracking(orderNumber);
  const { data: invoice } = useOrderInvoice(orderNumber);

  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error("Bekor qilish sababini kiriting");
      return;
    }
    try {
      setIsCancelling(true);
      await ordersService.cancelOrder(orderNumber, { reason: cancelReason });
      toast.success("Buyurtma bekor qilindi");
      setIsCancelModalOpen(false);
      setIsCancelling(false);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch {
      setIsCancelling(false);
      toast.error("Buyurtmani bekor qilishda xatolik yuz berdi");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400">
        Buyurtma ma&apos;lumotlari yuklanmoqda...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Buyurtma topilmadi</h3>
        <Link href="/account/orders">
          <Button size="sm">Barcha buyurtmalarga qaytish</Button>
        </Link>
      </div>
    );
  }

  const milestones = tracking?.milestones || [
    {
      title: "Buyurtma qabul qilindi",
      description: "Tizimda muvaffaqiyatli ro'yxatga olindi",
      timestamp: order.created_at,
      completed: true,
      current: order.status === "PENDING",
    },
    {
      title: "Tasdiqlandi va qadoqlanmoqda",
      description: "Ombordan yig'ilmoqda",
      timestamp: "",
      completed: ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"].includes(
        order.status
      ),
      current: ["CONFIRMED", "PROCESSING"].includes(order.status),
    },
    {
      title: "Kuryerga topshirildi",
      description: "Yetkazib berish jarayonida",
      timestamp: "",
      completed: ["SHIPPED", "DELIVERED"].includes(order.status),
      current: order.status === "SHIPPED",
    },
    {
      title: "Yetkazib berildi",
      description: "Qabul qiluvchiga topshirildi",
      timestamp: "",
      completed: order.status === "DELIVERED",
      current: order.status === "DELIVERED",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Barcha buyurtmalar
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 font-mono">
              #{order.order_number}
            </h1>
            <Badge variant="default">{order.status}</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Yaratilgan vaqti: {formatDate(order.created_at)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} variant="outline" size="sm" className="gap-1.5">
            <Printer className="h-4 w-4" />
            <span>Kvitansiya (Invoice)</span>
          </Button>

          {order.status === "PENDING" && (
            <Button
              onClick={() => setIsCancelModalOpen(true)}
              variant="danger"
              size="sm"
            >
              Bekor qilish
            </Button>
          )}
        </div>
      </div>

      {/* Tracking Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-indigo-600" />
            <CardTitle className="text-sm">
              Yetkazib berish holati (Tracking)
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {milestones.map((step, idx) => (
              <div
                key={idx}
                className="flex sm:flex-col items-center sm:text-center gap-3"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    step.completed
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    idx + 1
                  )}
                </div>
                <div>
                  <h4
                    className={`text-xs font-bold ${
                      step.current ? "text-indigo-600" : "text-slate-800"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items list */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Xarid qilingan tovarlar</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0">
                      <ShoppingBag className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {item.product_name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        SKU: {item.sku} &bull; {item.quantity} dona
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-900">
                    {formatCurrency(item.total_price)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: Address & Totals */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-600" />
                <CardTitle className="text-sm">Yetkazish manzili</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-slate-600 space-y-1.5">
              <p className="font-bold text-slate-900">
                {order.shipping_address?.recipient_name}
              </p>
              <p>{order.shipping_address?.phone_number}</p>
              <p>
                {order.shipping_address?.region}, {order.shipping_address?.district}
              </p>
              <p>{order.shipping_address?.street_address}</p>
              {order.shipping_address?.landmark && (
                <p className="text-slate-400">
                  Mo&apos;ljal: {order.shipping_address.landmark}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-indigo-600" />
                <CardTitle className="text-sm">To&apos;lov xulosasi</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Mahsulotlar:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Yetkazib berish:</span>
                <span>{formatCurrency(order.shipping_fee)}</span>
              </div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Chegirma:</span>
                  <span>-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-sm">
                <span>Jami:</span>
                <span className="text-indigo-600">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cancel Order Dialog */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Buyurtmani bekor qilish
            </h3>
            <p className="text-xs text-slate-500">
              Buyurtmani bekor qilish sababini ko&apos;rsating:
            </p>
            <textarea
              rows={3}
              placeholder="Masalan: Boshqa tovar tanladim yoki manzilni noto'g'ri kiritdim"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-indigo-600"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCancelModalOpen(false)}
              >
                Ortga
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={isCancelling}
                onClick={handleCancelOrder}
              >
                Tasdiqlash
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-slate-400">
          Yuklanmoqda...
        </div>
      }
    >
      <OrderDetailContent params={params} />
    </Suspense>
  );
}
