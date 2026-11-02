"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  User,
  Bell,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCartStore } from "@/store/useCartStore";
import { useCategories, useSearchSuggestions } from "@/features/catalog/hooks/useCatalog";
import { formatCurrency } from "@/lib/formatters";
import { CartDrawer } from "@/features/cart/components/cart-drawer";

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { itemCount, setIsDrawerOpen } = useCartStore();
  const { data: categories } = useCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { data: suggestions, isLoading: isSuggesting } = useSearchSuggestions(searchQuery);

  // Close search suggestions when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const hasSuggestions =
    suggestions &&
    (suggestions.products?.length > 0 ||
      suggestions.categories?.length > 0 ||
      suggestions.brands?.length > 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        {/* Top bar announcement */}
        <div className="bg-slate-900 text-slate-300 py-1.5 px-4 text-xs font-medium text-center">
          <span>O&apos;zbekiston bo&apos;ylab 24/7 tezkor yetkazib berish xizmati &bull; Payme va Click orqali to&apos;lov</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-4 sm:gap-8">
            {/* Logo & Category Button */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-slate-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <span className="hidden sm:inline">Ecommerce</span>
              </Link>

              {/* Mega-menu / Category Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className="hidden md:inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  <Layers className="h-4 w-4" />
                  <span>Katalog</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isCategoryMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Categories Dropdown */}
                {isCategoryMenuOpen && (
                  <div
                    className="absolute left-0 mt-2 w-72 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setIsCategoryMenuOpen(false)}
                  >
                    <div className="text-xs font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                      Barcha kategoriyalar
                    </div>
                    <div className="space-y-1">
                      {categories?.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/catalog?category=${cat.slug}`}
                          onClick={() => setIsCategoryMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                        >
                          <span>{cat.name}</span>
                          {cat.product_count !== undefined && (
                            <span className="text-xs text-slate-400">
                              {cat.product_count}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Central Autocomplete Search Bar */}
            <div
              ref={searchContainerRef}
              className="relative flex-1 max-w-xl mx-auto"
            >
              <form onSubmit={handleSearchSubmit}>
                <div className="relative flex items-center">
                  <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Mahsulotlar, brendlar yoki toifalarni qidiring..."
                    className="w-full h-11 pl-10 pr-24 rounded-2xl border border-slate-200 bg-slate-50/60 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 h-8 px-3.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Qidirish
                  </button>
                </div>
              </form>

              {/* Live Autocomplete Suggestions Box */}
              {isSearchOpen && hasSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl z-50 space-y-4 max-h-[75vh] overflow-y-auto">
                  {/* Products */}
                  {suggestions.products?.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Mahsulotlar
                      </span>
                      <div className="space-y-1">
                        {suggestions.products.map((item) => (
                          <Link
                            key={item.id}
                            href={`/products/${item.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-10 w-10 rounded-lg object-contain border border-slate-100 p-0.5"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                <ShoppingBag className="h-5 w-5" />
                              </div>
                            )}
                            <div className="flex-1 overflow-hidden">
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                {item.name}
                              </p>
                              {item.price && (
                                <p className="text-xs text-indigo-600 font-bold">
                                  {formatCurrency(item.price)}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Categories */}
                  {suggestions.categories?.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Kategoriyalar
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {suggestions.categories.map((c) => (
                          <Link
                            key={c.id}
                            href={`/catalog?category=${c.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Brands */}
                  {suggestions.brands?.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Brendlar
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {suggestions.brands.map((b) => (
                          <Link
                            key={b.id}
                            href={`/catalog?brand=${b.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            {b.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Account */}
              {isAuthenticated ? (
                <Link
                  href="/account/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs">
                    {user?.first_name ? user.first_name[0].toUpperCase() : "U"}
                  </div>
                  <span className="hidden lg:inline text-xs font-semibold">
                    {user?.first_name}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-xs font-bold text-slate-800 hover:bg-slate-200 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Kirish</span>
                </Link>
              )}

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="relative flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-3.5 py-2 text-xs font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Savat</span>
                {itemCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Categories Bar Navigation */}
        <div className="border-t border-slate-100 bg-slate-50/50 hidden md:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-6 overflow-x-auto py-2.5 text-xs font-semibold text-slate-600">
              <Link
                href="/catalog"
                className="text-indigo-600 hover:text-indigo-700 shrink-0 font-bold"
              >
                Barcha mahsulotlar
              </Link>
              {categories?.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalog?category=${cat.slug}`}
                  className="hover:text-slate-900 shrink-0 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Cart Slide-Over Drawer */}
      <CartDrawer />
    </>
  );
}
