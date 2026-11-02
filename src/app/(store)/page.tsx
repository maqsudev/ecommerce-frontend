"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Percent,
  CheckCircle2,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import { useCategories, useFeaturedProducts, useBrands } from "@/features/catalog/hooks/useCatalog";
import { ProductCard } from "@/components/common/product-card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const { data: featuredProducts, isLoading: isFeaturedLoading } = useFeaturedProducts();
  const { data: brands } = useBrands();

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 text-white">
        {/* Background decorative blurs */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-32 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 border border-white/15 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                Eng so&apos;nggi texnologiyalar mavsumi
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Zamonaviy gadjetlar va qulay onlayn xaridlar
              </h1>

              <p className="text-indigo-200/90 text-base sm:text-lg max-w-xl leading-relaxed">
                Smartfonlar, noutbuklar, aqlli soatlar va maishiy texnikani 100% rasmiy kafolat hamda tezkor yetkazib berish bilan xarid qiling.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/catalog">
                  <Button size="lg" className="shadow-lg shadow-indigo-500/30 gap-2">
                    <span>Katalogga o&apos;tish</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/catalog?ordering=-created_at">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Yangi mahsulotlar
                  </Button>
                </Link>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10 text-xs text-indigo-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Rasmiy servis kafolati</span>
                </div>
                <div className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-indigo-300" />
                  <span>Tezkor yetkazish</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Showcase */}
            <div className="relative hidden lg:flex justify-center">
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/20 backdrop-blur-md p-8 flex flex-col justify-between shadow-2xl">
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 rounded-xl bg-rose-500 text-white text-xs font-bold">
                    -25% Chegirma
                  </span>
                  <span className="text-xs text-indigo-200 font-mono">
                    Top Tavsiya
                  </span>
                </div>

                <div className="my-auto text-center space-y-4">
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-3xl bg-white/10 border border-white/20 text-white">
                    <ShoppingBag className="h-16 w-16 text-indigo-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Premium Elektronika
                  </h3>
                  <p className="text-xs text-indigo-200">
                    Barcha brendlar uchun maxsus takliflar
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/10 p-3.5 backdrop-blur-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-indigo-200">Boshlang&apos;ich narx:</p>
                    <p className="text-lg font-extrabold text-white">
                      1 200 000 so&apos;m dan
                    </p>
                  </div>
                  <Link href="/catalog">
                    <Button size="sm" variant="secondary">
                      Ko&apos;rish
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Ommabop kategoriyalar
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Eng ko&apos;p izlanayotgan tovarlar bo&apos;limi
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Barchasi
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog?category=${cat.slug}`}
              className="group flex flex-col items-center text-center p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-indigo-500 hover:shadow-lg transition-all"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <span className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </span>
              {cat.product_count !== undefined && (
                <span className="text-xs text-slate-400 mt-0.5">
                  {cat.product_count} ta tovar
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="h-4 w-4" />
              Tavsiya etilgan
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Haftaning eng sara mahsulotlari
            </h2>
          </div>
          <Link
            href="/catalog"
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Ko&apos;proq ko&apos;rish
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
            Hozircha tavsiya etilgan tovarlar mavjud emas
          </div>
        )}
      </section>

      {/* Brand Partners Showcase */}
      {brands && brands.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-8">
            <h3 className="text-base font-bold text-slate-900 mb-6 text-center">
              Rasmiy brendlar va hamkorlarimiz
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/catalog?brand=${brand.slug}`}
                  className="px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
