"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

export function CartDrawer() {
  const { cart, isDrawerOpen, setIsDrawerOpen, fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (!isDrawerOpen) return null;

  const handleUpdateQuantity = async (itemId: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    try {
      await apiClient.patch(`/api/v1/cart/items/${itemId}/`, {
        quantity: newQty,
      });
      await fetchCart();
    } catch {
      toast.error("Miqdorni o'zgartirishda xatolik");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await apiClient.delete(`/api/v1/cart/items/${itemId}/`);
      await fetchCart();
      toast.success("Mahsulot savatdan olib tashlandi");
    } catch {
      toast.error("O'chirishda xatolik yuz berdi");
    }
  };

  const handleClearCart = async () => {
    try {
      await apiClient.post("/api/v1/cart/clear/");
      await fetchCart();
      toast.success("Savat tozalandi");
    } catch {
      toast.error("Savatni tozalashda xatolik");
    }
  };

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Xaridlar savati
                </h2>
                <p className="text-xs text-slate-500">
                  {cart?.total_items ?? 0} ta mahsulot
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEmpty && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-xs text-slate-400 hover:text-rose-600 transition-colors px-2 py-1"
                >
                  Tozalash
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body: Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Savatingiz hozircha bo&apos;sh
                </h3>
                <p className="text-sm text-slate-500 mt-1 max-w-xs">
                  O&apos;zingizga ma&apos;qul mahsulotlarni tanlang va savatingizga qo&apos;shing
                </p>
                <Button
                  onClick={() => setIsDrawerOpen(false)}
                  className="mt-6"
                  size="md"
                >
                  Katalogga o&apos;tish
                </Button>
              </div>
            ) : (
              items.map((item) => {
                const itemImg =
                  item.variant?.image ||
                  item.product?.images?.[0]?.image ||
                  "";

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    {/* Item Image */}
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200/60 bg-white flex items-center justify-center">
                      {itemImg ? (
                        <img
                          src={itemImg}
                          alt={item.variant?.name || "Mahsulot"}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <ShoppingBag className="h-8 w-8 text-slate-300" />
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                            {item.product?.name || item.variant?.name || "Mahsulot"}
                          </h4>
                          {item.variant?.sku && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              SKU: {item.variant.sku}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/40">
                        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="text-slate-500 hover:text-slate-900 p-0.5"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="text-slate-500 hover:text-slate-900 p-0.5"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-slate-900">
                          {formatCurrency(item.total_price || Number(item.unit_price) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer: Subtotal and Checkout Button */}
          {!isEmpty && (
            <div className="p-6 border-t border-slate-100 bg-slate-50/80 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Oraliq summa:</span>
                  <span>{formatCurrency(cart?.subtotal)}</span>
                </div>
                {Number(cart?.discount || 0) > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Chegirma:</span>
                    <span>-{formatCurrency(cart?.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Jami to&apos;lov:</span>
                  <span className="text-indigo-600">
                    {formatCurrency(cart?.total || cart?.subtotal)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full"
                >
                  <Button className="w-full" size="lg">
                    <span>Buyurtmani rasmiylashtirish</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-center text-xs text-slate-500 hover:text-slate-900 py-1 transition-colors"
                >
                  Xaridni davom ettirish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
