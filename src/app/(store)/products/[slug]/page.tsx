"use client";

import { use, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Check,
  RotateCcw,
  Plus,
  Minus,
  ChevronRight,
} from "lucide-react";
import { useProduct } from "@/features/catalog/hooks/useCatalog";
import { ProductVariant } from "@/types/catalog";
import { formatCurrency } from "@/lib/formatters";
import { useCartStore } from "@/store/useCartStore";
import { ProductReviews } from "@/features/reviews/components/product-reviews";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";

function ProductDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { data: product, isLoading, isError } = useProduct(slug);
  const { fetchCart, setIsDrawerOpen } = useCartStore();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.variants?.length > 0 && !selectedVariant) {
        setSelectedVariant(product.variants[0]);
      }
      const primary =
        product.images?.find((img) => img.is_primary)?.image ||
        product.images?.[0]?.image ||
        "";
      setSelectedImage(primary);
    }
  }, [product, selectedVariant]);

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    if (variant.image) {
      setSelectedImage(variant.image);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Mahsulot varianti tanlanmagan");
      return;
    }

    try {
      setIsAdding(true);
      await apiClient.post("/api/v1/cart/items/", {
        variant_id: selectedVariant.id,
        quantity,
      });
      await fetchCart();
      setIsAdding(false);
      toast.success(`${product?.name} savatga qo'shildi!`);
      setIsDrawerOpen(true);
    } catch {
      setIsAdding(false);
      toast.error("Savatga qo'shishda xatolik yuz berdi");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-slate-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/4" />
            <div className="h-24 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Mahsulot topilmadi
        </h2>
        <p className="text-sm text-slate-500">
          Ushbu manzil bo&apos;yicha tovar mavjud emas yoki o&apos;chirilgan
        </p>
        <Link href="/catalog">
          <Button size="md">Katalogga qaytish</Button>
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant?.price ?? product.base_price;
  const comparePrice = selectedVariant?.compare_at_price ?? product.discount_price;
  const isInStock = selectedVariant ? selectedVariant.in_stock : product.in_stock;
  const stockQuantity = selectedVariant?.stock_quantity ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-indigo-600 transition-colors">
          Bosh sahifa
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <Link href="/catalog" className="hover:text-indigo-600 transition-colors">
          Katalog
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="text-slate-800 font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm flex items-center justify-center overflow-hidden">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.name}
                className="h-full w-full object-contain transition-all duration-300"
              />
            ) : (
              <ShoppingBag className="h-20 w-20 text-slate-300" />
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImage(img.image)}
                  className={`h-20 w-20 shrink-0 rounded-2xl border-2 bg-white p-1 transition-all overflow-hidden ${
                    selectedImage === img.image
                      ? "border-indigo-600 shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={img.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buy Box & Variants */}
        <div className="space-y-6">
          <div>
            {product.brand && (
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
                {typeof product.brand === "object" ? product.brand.name : ""}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-xs font-bold text-slate-800">
                  {product.rating ? Number(product.rating).toFixed(1) : "5.0"}
                </span>
              </div>
              <span className="text-xs text-slate-400">&bull;</span>
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                {product.review_count ?? 0} ta sharh
              </button>
              <span className="text-xs text-slate-400">&bull;</span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="h-3 w-3" />
                Kafolatlangan original
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                {formatCurrency(currentPrice)}
              </span>
              {comparePrice && Number(comparePrice) > Number(currentPrice) && (
                <span className="text-sm font-medium text-slate-400 line-through">
                  {formatCurrency(comparePrice)}
                </span>
              )}
            </div>

            <div className="pt-2">
              {isInStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Omborda mavjud ({stockQuantity} dona)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-100/70 px-2.5 py-0.5 rounded-full">
                  Hozircha sotuvda yo&apos;q
                </span>
              )}
            </div>
          </div>

          {/* Variant Matrix Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Modifikatsiyani tanlang:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleSelectVariant(v)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {v.name || v.sku}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Miqdor:</span>
              <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-slate-500 hover:text-slate-900 p-1"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-slate-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-slate-500 hover:text-slate-900 p-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCart}
                isLoading={isAdding}
                disabled={!isInStock}
                size="lg"
                className="flex-1 shadow-md shadow-indigo-200"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Savatga qo&apos;shish
              </Button>
            </div>
          </div>

          {/* Value Props Info */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <Truck className="h-4 w-4 text-indigo-600 shrink-0" />
              <span>
                Yetkazib berish: <strong>24 soat ichida eshikkacha</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Kafolat: <strong>12 oylik rasmiy servis kafolati</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="h-4 w-4 text-violet-600 shrink-0" />
              <span>
                Qaytarish: <strong>14 kun ichida oson qaytarish</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs: Description, Specs, Reviews */}
      <div className="pt-8 border-t border-slate-200/80">
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab("desc")}
            className={`pb-4 px-6 text-sm font-bold transition-all border-b-2 -mb-px ${
              activeTab === "desc"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Tavsif
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("specs")}
            className={`pb-4 px-6 text-sm font-bold transition-all border-b-2 -mb-px ${
              activeTab === "specs"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Xususiyatlari
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 px-6 text-sm font-bold transition-all border-b-2 -mb-px ${
              activeTab === "reviews"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Sharhlar ({product.review_count ?? 0})
          </button>
        </div>

        <div className="pt-8">
          {activeTab === "desc" && (
            <div className="prose max-w-none text-sm text-slate-600 leading-relaxed space-y-4">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="max-w-2xl">
              <table className="w-full text-xs text-slate-700">
                <tbody>
                  {product.attributes &&
                    Object.entries(product.attributes).map(([key, val], idx) => (
                      <tr
                        key={key}
                        className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}
                      >
                        <td className="py-3 px-4 font-semibold text-slate-500 capitalize w-1/3">
                          {key.replace(/_/g, " ")}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {String(val)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "reviews" && (
            <ProductReviews productId={product.id} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400">
          Mahsulot ma&apos;lumotlari yuklanmoqda...
        </div>
      }
    >
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
