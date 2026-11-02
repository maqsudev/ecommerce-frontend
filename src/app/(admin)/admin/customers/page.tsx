"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, ShieldAlert, ShieldCheck, Search } from "lucide-react";
import { adminService } from "@/features/admin/services/admin.service";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CustomerDossier } from "@/types/dashboard";

export default function AdminCustomersPage() {
  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: () => adminService.getAdminCustomers(),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (customerId: number) =>
      adminService.toggleCustomerStatus(customerId),
    onSuccess: () => {
      toast.success("Mijoz holati yangilandi");
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
    },
    onError: () => {
      toast.error("Holatni o'zgartirishda xatolik yuz berdi");
    },
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Mijozlar CRM & Dosyesi
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Foydalanuvchilar profillari, sarflangan jami mablag&apos; va akkaunt nazorati
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Mijoz</th>
                <th className="py-3 px-4">Telefon</th>
                <th className="py-3 px-4 text-center">Buyurtmalar soni</th>
                <th className="py-3 px-4">Jami xarid summasi</th>
                <th className="py-3 px-4 text-center">Holati</th>
                <th className="py-3 px-4 text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Mijozlar ro&apos;yxati yuklanmoqda...
                  </td>
                </tr>
              ) : customers && customers.length > 0 ? (
                customers.map((cust: CustomerDossier) => (
                  <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{cust.name}</div>
                      <span className="text-[11px] text-slate-400 font-sans">
                        {cust.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {cust.phone_number || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-900">
                      {cust.total_orders} ta
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">
                      {formatCurrency(cust.total_spent)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {cust.is_active ? (
                        <Badge variant="success">Faol</Badge>
                      ) : (
                        <Badge variant="danger">Bloklangan</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant={cust.is_active ? "danger" : "outline"}
                        isLoading={toggleStatusMutation.isPending}
                        onClick={() => toggleStatusMutation.mutate(cust.id)}
                      >
                        {cust.is_active ? "Bloklash" : "Faollashtirish"}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Mijozlar ma&apos;lumotlari mavjud emas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
