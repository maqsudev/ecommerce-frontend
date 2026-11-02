"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, Edit, Clock, MapPin, Truck, Check } from "lucide-react";
import { adminService } from "@/features/admin/services/admin.service";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Order, OrderStatus } from "@/types/orders";

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>("CONFIRMED");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [statusComment, setStatusComment] = useState("");
  const [internalNote, setInternalNote] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin", "orders", statusFilter],
    queryFn: () => adminService.getAdminOrders(statusFilter || undefined),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async () => {
      if (!selectedOrder) return;
      await adminService.updateOrderStatus(selectedOrder.order_number, {
        new_status: newStatus,
        tracking_number: trackingNumber || undefined,
        comment: statusComment || undefined,
        is_customer_visible: true,
      });

      if (internalNote.trim()) {
        await adminService.addOrderNote(selectedOrder.order_number, internalNote);
      }
    },
    onSuccess: () => {
      toast.success("Buyurtma holati yangilandi");
      setSelectedOrder(null);
      setTrackingNumber("");
      setStatusComment("");
      setInternalNote("");
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
    onError: () => {
      toast.error("Holatni yangilashda xatolik yuz berdi");
    },
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="warning">Kutilmoqda</Badge>;
      case "CONFIRMED":
        return <Badge variant="default">Tasdiqlandi</Badge>;
      case "PROCESSING":
        return <Badge variant="default">Qadoqlanmoqda</Badge>;
      case "SHIPPED":
        return <Badge variant="secondary">Kuryerda</Badge>;
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Buyurtmalar boshqaruvi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Barcha kelib tushgan buyurtmalar, kuryer kuzatuvi va holat o&apos;zgartirish
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-xs"
          >
            <option value="">Barcha holatlar</option>
            <option value="PENDING">Kutilmoqda (PENDING)</option>
            <option value="CONFIRMED">Tasdiqlangan (CONFIRMED)</option>
            <option value="PROCESSING">Jarayonda (PROCESSING)</option>
            <option value="SHIPPED">Kuryerda (SHIPPED)</option>
            <option value="DELIVERED">Yetkazilgan (DELIVERED)</option>
            <option value="CANCELLED">Bekor qilingan (CANCELLED)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Buyurtma #</th>
                <th className="py-3 px-4">Xaridor & Telefon</th>
                <th className="py-3 px-4">Summasi</th>
                <th className="py-3 px-4">To&apos;lov</th>
                <th className="py-3 px-4 text-center">Holati</th>
                <th className="py-3 px-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Buyurtmalar yuklanmoqda...
                  </td>
                </tr>
              ) : orders && orders.length > 0 ? (
                orders.map((ord: Order) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                      #{ord.order_number}
                      <span className="block text-[10px] text-slate-400 font-sans">
                        {formatDate(ord.created_at)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {ord.shipping_address?.recipient_name || "Mijoz"}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {ord.shipping_address?.phone_number}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      {formatCurrency(ord.total_amount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 font-semibold">
                        {ord.payment_method}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {getStatusBadge(ord.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(ord);
                          setNewStatus(ord.status);
                        }}
                        className="gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Holatni o&apos;zgartirish</span>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Buyurtmalar mavjud emas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Buyurtma #{selectedOrder.order_number} holatini yangilash
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Yangi holatni tanlang:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs font-bold outline-none"
                >
                  <option value="CONFIRMED">Tasdiqlangan (CONFIRMED)</option>
                  <option value="PROCESSING">Qadoqlanmoqda (PROCESSING)</option>
                  <option value="SHIPPED">Kuryerga berildi (SHIPPED)</option>
                  <option value="DELIVERED">Yetkazildi (DELIVERED)</option>
                  <option value="CANCELLED">Bekor qilish (CANCELLED)</option>
                </select>
              </div>

              {newStatus === "SHIPPED" && (
                <Input
                  label="Kuryer kuzatuv raqami (Tracking Number)"
                  placeholder="Masalan: UZEX-20261102-9988"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  leftIcon={<Truck className="h-4 w-4" />}
                />
              )}

              <Input
                label="Mijoz uchun eslatma"
                placeholder="Buyurtmangiz kuryerga topshirildi"
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
              />

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Xodimlar uchun ichki yopiq eslatma (Pinned Note)
                </label>
                <textarea
                  rows={2}
                  placeholder="Mijoz bilan telefon orqali gaplashildi, yetkazish vaqti soat 17:00 dan so'ng"
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Bekor qilish
              </Button>
              <Button
                size="sm"
                isLoading={updateStatusMutation.isPending}
                onClick={() => updateStatusMutation.mutate()}
              >
                Saqlash va mijozga bildirish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
