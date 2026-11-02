"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

export default function CartPage() {
  const { cart, fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

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

  if (isEmpty) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-md mx-auto space-y-5">
          <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600">
            <ShoppingBag className="h-12 w-12" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Savatingiz hozircha bo&apos;sh
          </h1>
          <p className="text-sm text-slate-500">
            Bosh sahifaga qaytib, kerakli gadjet va tovarlarni tanlang
          </p>
          <div className="pt-2">
            <Link href="/catalog">
              <Button size="lg">Katalogga o&apos;tish</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Savatingizdagi mahsulotlar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Jami <strong className="text-slate-800">{cart?.total_items ?? items.length}</strong> ta mahsulot
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearCart}
          className="text-xs text-slate-500 hover:text-rose-600 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          Savatni tozalash
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const itemImg =
              item.variant?.image ||
              item.product?.images?.[0]?.image ||
              "";

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm"
              >
                {/* Image & Info */}
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1 flex items-center justify-center">
                    {itemImg ? (
                      <img
                        src={itemImg}
                        alt={item.variant?.name || "Tovar"}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <ShoppingBag className="h-8 w-8 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {item.product?.name || item.variant?.name}
                    </h3>
                    {item.variant?.sku && (
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">
                        SKU: {item.variant.sku}
                      </p>
                    )}
                    <p className="text-xs font-semibold text-indigo-600 mt-1">
                      {formatCurrency(item.unit_price)} / dona
                    </p>
                  </div>
                </div>

                {/* Counter & Total & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-2 py-1">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      className="text-slate-500 hover:text-slate-900 p-1"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="text-slate-500 hover:text-slate-900 p-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-extrabold text-slate-900 min-w-24 text-right">
                    {formatCurrency(item.total_price || Number(item.unit_price) * item.quantity)}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Box */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-6 sticky top-24">
          <h2 className="text-base font-bold text-slate-900">
            Buyurtma xulosasi
          </h2>

          <div className="space-y-3 text-xs text-slate-600 pb-4 border-b border-slate-100">
            <div className="flex justify-between">
              <span>Mahsulotlar soni:</span>
              <span className="font-semibold text-slate-900">
                {cart?.total_items ?? items.length} ta
              </span>
            </div>
            <div className="flex justify-between">
              <span>Oraliq summa:</span>
              <span className="font-semibold text-slate-900">
                {formatCurrency(cart?.subtotal)}
              </span>
            </div>
            {Number(cart?.discount || 0) > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Chegirma:</span>
                <span>-{formatCurrency(cart?.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Yetkazib berish:</span>
              <span className="text-emerald-600 font-semibold">
                Hisob-kitobda aniqlanadi
              </span>
            </div>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-900">
              Jami to&apos;lov summasi:
            </span>
            <span className="text-2xl font-black text-indigo-600">
              {formatCurrency(cart?.total || cart?.subtotal)}
            </span>
          </div>

          <Link href="/checkout" className="block">
            <Button size="lg" className="w-full shadow-md shadow-indigo-200">
              <span>Rasmiylashtirishga o&apos;tish</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>

          {/* Guarantees */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <Truck className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span>O&apos;zbekiston bo&apos;ylab qulay yetkazib berish</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>100% xavfsiz to&apos;lov kafolati</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
