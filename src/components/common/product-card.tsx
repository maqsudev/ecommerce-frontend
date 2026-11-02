"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/types/catalog";
import { formatCurrency } from "@/lib/formatters";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { fetchCart, setIsDrawerOpen } = useCartStore();

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image ||
    product.images?.[0]?.image ||
    "/placeholder-product.png";

  const defaultVariant = product.variants?.[0];
  const hasDiscount =
    product.discount_price && Number(product.discount_price) < Number(product.base_price);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant) {
      toast.error("Mahsulot varianti mavjud emas");
      return;
    }

    try {
      await apiClient.post("/api/v1/cart/items/", {
        variant_id: defaultVariant.id,
        quantity: 1,
      });
      await fetchCart();
      toast.success(`${product.name} savatga qo'shildi!`);
      setIsDrawerOpen(true);
    } catch {
      toast.error("Savatga qo'shishda xatolik yuz berdi");
    }
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300">
      {/* Discount Badge */}
      {hasDiscount && (
        <span className="absolute left-3 top-3 z-10 rounded-lg bg-rose-600 px-2 py-1 text-[11px] font-bold text-white shadow-sm">
          Chegirma
        </span>
      )}

      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center"
      >
        {primaryImage && primaryImage.startsWith("http") ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
            <ShoppingBag className="h-12 w-12 stroke-[1.5]" />
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="mt-4 flex flex-1 flex-col">
        {/* Brand */}
        {product.brand && (
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {typeof product.brand === "object" ? product.brand.name : ""}
          </span>
        )}

        {/* Name */}
        <Link
          href={`/products/${product.slug}`}
          className="mt-1 text-sm font-semibold text-slate-800 line-clamp-2 hover:text-indigo-600 transition-colors"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center text-amber-400">
            <Star className="h-3.5 w-3.5 fill-current" />
          </div>
          <span className="text-xs font-semibold text-slate-700">
            {product.rating ? Number(product.rating).toFixed(1) : "5.0"}
          </span>
          <span className="text-xs text-slate-400">
            ({product.review_count ?? 0})
          </span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-4 flex items-end justify-between gap-2 border-t border-slate-100">
          <div>
            {hasDiscount ? (
              <>
                <p className="text-base font-bold text-slate-900 leading-tight">
                  {formatCurrency(product.discount_price)}
                </p>
                <p className="text-xs font-medium text-slate-400 line-through">
                  {formatCurrency(product.base_price)}
                </p>
              </>
            ) : (
              <p className="text-base font-bold text-slate-900 leading-tight">
                {formatCurrency(product.base_price)}
              </p>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            aria-label="Savatga qo'shish"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
