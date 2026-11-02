"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check } from "lucide-react";
import { useProducts, useCatalogFilters } from "@/features/catalog/hooks/useCatalog";
import { ProductCard } from "@/components/common/product-card";
import { Button } from "@/components/ui/button";
import { ProductQueryParams } from "@/types/catalog";

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category") || "";
  const brandParam = searchParams.get("brand") || "";
  const qParam = searchParams.get("q") || "";
  const orderingParam = searchParams.get("ordering") || "-created_at";
  const inStockParam = searchParams.get("in_stock") === "true";
  const minPriceParam = searchParams.get("min_price") || "";
  const maxPriceParam = searchParams.get("max_price") || "";
  const pageParam = Number(searchParams.get("page")) || 1;

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [inStockOnly, setInStockOnly] = useState(inStockParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [ordering, setOrdering] = useState(orderingParam);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setSelectedBrand(brandParam);
    setInStockOnly(inStockParam);
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
    setOrdering(orderingParam);
  }, [categoryParam, brandParam, inStockParam, minPriceParam, maxPriceParam, orderingParam]);

  const queryFilters: ProductQueryParams = {
    category: selectedCategory || undefined,
    brand: selectedBrand || undefined,
    q: qParam || undefined,
    in_stock: inStockOnly ? true : undefined,
    min_price: minPrice ? Number(minPrice) : undefined,
    max_price: maxPrice ? Number(maxPrice) : undefined,
    ordering: ordering as any,
    page: pageParam,
    page_size: 20,
  };

  const { data: productsData, isLoading, isError } = useProducts(queryFilters);
  const { data: filtersData } = useCatalogFilters(selectedCategory);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedBrand) params.set("brand", selectedBrand);
    if (qParam) params.set("q", qParam);
    if (inStockOnly) params.set("in_stock", "true");
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (ordering) params.set("ordering", ordering);
    params.set("page", "1");

    router.push(`/catalog?${params.toString()}`);
    setIsFilterDrawerOpen(false);
  };

  const resetFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setInStockOnly(false);
    setMinPrice("");
    setMaxPrice("");
    setOrdering("-created_at");
    router.push("/catalog");
  };

  const products = productsData?.results || [];
  const totalCount = productsData?.count || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {qParam ? `"${qParam}" bo'yicha qidiruv natijalari` : "Mahsulotlar katalogi"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Jami <strong className="text-slate-800">{totalCount}</strong> ta mahsulot topildi
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm"
          >
            <Filter className="h-4 w-4" />
            <span>Filtrlar</span>
          </button>

          {/* Ordering Select */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Saralash:</span>
            <select
              value={ordering}
              onChange={(e) => {
                setOrdering(e.target.value);
                const params = new URLSearchParams(searchParams.toString());
                params.set("ordering", e.target.value);
                router.push(`/catalog?${params.toString()}`);
              }}
              className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="-created_at">Eng yangilari</option>
              <option value="base_price">Arzonroqdan qimmatroqqa</option>
              <option value="-base_price">Qimmatroqdan arzonroqqa</option>
              <option value="-rating">Reyting bo&apos;yicha</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Left Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
                Filtrlar
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-indigo-600 hover:underline"
              >
                Tozalash
              </button>
            </div>

            {/* In Stock toggle */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Faqat mavjud tovarlar
                </span>
              </label>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Narx oralig&apos;i (so&apos;m)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Dan"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-9 px-2.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none"
                />
                <input
                  type="number"
                  placeholder="Gacha"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-9 px-2.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Categories Filter */}
            {filtersData?.categories && filtersData.categories.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Kategoriyalar
                </span>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {filtersData.categories.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer py-1"
                    >
                      <input
                        type="radio"
                        name="cat_filter"
                        checked={selectedCategory === c.slug}
                        onChange={() =>
                          setSelectedCategory(selectedCategory === c.slug ? "" : c.slug)
                        }
                        className="text-indigo-600"
                      />
                      <span>{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Brands Filter */}
            {filtersData?.brands && filtersData.brands.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Brendlar
                </span>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {filtersData.brands.map((b) => (
                    <label
                      key={b.id}
                      className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer py-1"
                    >
                      <input
                        type="radio"
                        name="brand_filter"
                        checked={selectedBrand === b.slug}
                        onChange={() =>
                          setSelectedBrand(selectedBrand === b.slug ? "" : b.slug)
                        }
                        className="text-indigo-600"
                      />
                      <span>{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={applyFilters} className="w-full" size="sm">
              Filtrlash
            </Button>
          </div>
        </aside>

        {/* Right Products Grid */}
        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-72 rounded-2xl bg-white border border-slate-100 animate-pulse p-4 space-y-3"
                >
                  <div className="h-40 bg-slate-100 rounded-xl" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-16 text-center bg-white space-y-3">
              <p className="text-base font-bold text-slate-800">
                Mos keluvchi mahsulotlar topilmadi
              </p>
              <p className="text-xs text-slate-500">
                Filtr sozlamalarini o&apos;zgartirib ko&apos;ring yoki boshqa so&apos;z bilan qidiring
              </p>
              <Button onClick={resetFilters} variant="outline" size="sm" className="mt-2">
                Filtrlarni tozalash
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto p-12 text-center text-slate-400">
          Katalog yuklanmoqda...
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
