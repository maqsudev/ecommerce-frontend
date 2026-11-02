"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Boxes, AlertTriangle, Plus, Minus, Search, Edit2 } from "lucide-react";
import { adminService } from "@/features/admin/services/admin.service";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { InventoryStockItem } from "@/types/dashboard";

export default function AdminInventoryPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [adjustModalItem, setAdjustModalItem] = useState<InventoryStockItem | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState(10);
  const [adjustReason, setAdjustReason] = useState<"RESTOCK" | "INVENTORY_COUNT" | "DAMAGED">("RESTOCK");

  const { data: stocks, isLoading } = useQuery({
    queryKey: ["admin", "inventory"],
    queryFn: () => adminService.getInventoryStocks(),
  });

  const adjustMutation = useMutation({
    mutationFn: () => {
      if (!adjustModalItem) throw new Error("Variant tanlanmadi");
      return adminService.adjustStock(adjustModalItem.variant_id, {
        adjustment: adjustmentAmount,
        reason: adjustReason,
      });
    },
    onSuccess: () => {
      toast.success("Ombor qoldig'i muvaffaqiyatli yangilandi");
      setAdjustModalItem(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
    },
    onError: () => {
      toast.error("Qoldiqni o'zgartirishda xatolik yuz berdi");
    },
  });

  const filteredStocks = (stocks || []).filter((item: InventoryStockItem) => {
    const matchesSearch =
      item.product_name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesLow = lowStockOnly ? item.is_low_stock : true;
    return matchesSearch && matchesLow;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Ombor qoldiqlari (Inventory)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tovarlar zaxirasi, qoldiq miqdorlari va harakatlar nazorati
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span>Faqat kam qolgan tovarlar</span>
          </label>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder="Mahsulot nomi yoki SKU bo'yicha qidiruv..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Inventory Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">SKU & Nomi</th>
                <th className="py-3 px-4">Narxi</th>
                <th className="py-3 px-4 text-center">Hozirgi qoldiq</th>
                <th className="py-3 px-4 text-center">Holati</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Ombor qoldiqlari yuklanmoqda...
                  </td>
                </tr>
              ) : filteredStocks.length > 0 ? (
                filteredStocks.map((item: InventoryStockItem) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {item.product_name}
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        {item.sku}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-black text-sm text-slate-900">
                        {item.current_stock} dona
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {item.is_low_stock ? (
                        <Badge variant="warning" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Kam qolgan (&lt;{item.low_stock_threshold})
                        </Badge>
                      ) : (
                        <Badge variant="success">Yetarli</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setAdjustModalItem(item);
                          setAdjustmentAmount(10);
                        }}
                        className="gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Tuzatish</span>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Qidiruvga mos keluvchi tovarlar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Adjust Modal */}
      {adjustModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Qoldiqni to&apos;g&apos;rilash
            </h3>
            <p className="text-xs text-slate-500">
              {adjustModalItem.product_name} (Hozirgi qoldiq:{" "}
              <strong>{adjustModalItem.current_stock} dona</strong>)
            </p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  O&apos;zgarish miqdori (+ yoki - dona)
                </label>
                <input
                  type="number"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Sabab
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as any)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs outline-none"
                >
                  <option value="RESTOCK">Yangi tovar kelishi (Restock)</option>
                  <option value="INVENTORY_COUNT">Inventarizatsiya hisobi</option>
                  <option value="DAMAGED">Buzilgan / Yaroqsiz tovar</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAdjustModalItem(null)}
              >
                Bekor qilish
              </Button>
              <Button
                size="sm"
                isLoading={adjustMutation.isPending}
                onClick={() => adjustMutation.mutate()}
              >
                Saqlash
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
