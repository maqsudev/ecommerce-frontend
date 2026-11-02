"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCheck,
  Package,
  CreditCard,
  Sparkles,
  Info,
  Trash2,
  Sliders,
} from "lucide-react";
import { notificationsService } from "@/features/notifications/services/notifications.service";
import { formatTimeAgo } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { NotificationType, Notification } from "@/types/notifications";

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState<string>("");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", "list", filterType],
    queryFn: () =>
      notificationsService.getNotifications(
        filterType ? { type: filterType } : {}
      ),
  });

  const { data: preferences } = useQuery({
    queryKey: ["notifications", "preferences"],
    queryFn: () => notificationsService.getPreferences(),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: () => {
      toast.success("Barcha xabarlar o'qildi");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: number | string) => notificationsService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) =>
      notificationsService.deleteNotification(id),
    onSuccess: () => {
      toast.success("Xabar o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const updatePrefMutation = useMutation({
    mutationFn: (payload: any) =>
      notificationsService.updatePreferences(payload),
    onSuccess: () => {
      toast.success("Sozlamalar saqlandi");
      queryClient.invalidateQueries({ queryKey: ["notifications", "preferences"] });
    },
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "ORDER":
        return <Package className="h-4 w-4 text-indigo-600" />;
      case "PAYMENT":
        return <CreditCard className="h-4 w-4 text-emerald-600" />;
      case "PROMO":
        return <Sparkles className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Xabarnomalar markazi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Buyurtmalar, to&apos;lovlar va aksiyalar haqidagi bildirishnomalar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => markAllMutation.mutate()}
            variant="outline"
            size="sm"
            className="gap-1.5"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Barchasini o&apos;qilgan qilish</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Notifications List */}
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-2xl bg-slate-200 animate-pulse"
                />
              ))}
            </div>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((notif: Notification) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.is_read) markReadMutation.mutate(notif.id);
                }}
                className={`flex items-start justify-between gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                  notif.is_read
                    ? "border-slate-100 bg-white"
                    : "border-indigo-100 bg-indigo-50/40 shadow-xs"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 mt-0.5">
                    {getNotificationIcon(notif.notification_type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        {notif.title}
                      </h4>
                      {!notif.is_read && (
                        <span className="h-2 w-2 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {formatTimeAgo(notif.created_at)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(notif.id);
                  }}
                  className="text-slate-300 hover:text-rose-500 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
              <Bell className="h-10 w-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                Yangi xabarnomalar yo&apos;q
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Barcha yangiliklar bu yerda ko&apos;rsatiladi
              </p>
            </div>
          )}
        </div>

        {/* Right Preferences Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-600" />
              <CardTitle className="text-sm">Xabarnoma sozlamalari</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span>Email aksiyalar va promolar</span>
              <input
                type="checkbox"
                checked={preferences?.email_promotions ?? true}
                onChange={(e) =>
                  updatePrefMutation.mutate({
                    email_promotions: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span>Ilova ichidagi yangiliklar</span>
              <input
                type="checkbox"
                checked={preferences?.in_app_promotions ?? true}
                onChange={(e) =>
                  updatePrefMutation.mutate({
                    in_app_promotions: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span>Buyurtma statusi o&apos;zgarishi</span>
              <input
                type="checkbox"
                checked={preferences?.order_updates ?? true}
                onChange={(e) =>
                  updatePrefMutation.mutate({
                    order_updates: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
            </label>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
