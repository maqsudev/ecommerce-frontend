"use client";

import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white">
      {/* Guarantees and Advantages banner */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Tezkor yetkazib berish
                </h4>
                <p className="text-xs text-slate-500">
                  O&apos;zbekiston bo&apos;ylab 24 soat ichida
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  100% Rasmiy kafolat
                </h4>
                <p className="text-xs text-slate-500">
                  Faqat sertifikatlangan tovarlar
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Qulay qaytarish
                </h4>
                <p className="text-xs text-slate-500">
                  14 kun ichida almashtirish imkoniyati
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Headphones className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  24/7 Qo&apos;llab-quvvatlash
                </h4>
                <p className="text-xs text-slate-500">
                  Har qanday savolingizga javob beramiz
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-slate-900 mb-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span>Ecommerce Store</span>
            </Link>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-6">
              Zamonaviy texnologiyalar, maishiy texnika va gadjetlar savdosi. Rasmiy kafolat, qulay muddatli to&apos;lov va tezkor xizmat.
            </p>

            {/* Payment Systems Icons */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Qabul qilinadigan to&apos;lov turlari:
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                  Payme
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                  Click
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                  Uzum
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                  Uzcard
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                  Humo
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                  Visa
                </span>
              </div>
            </div>
          </div>

          {/* Kolleksiyalar */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Xaridlar
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link href="/catalog" className="hover:text-indigo-600 transition-colors">
                  Barcha mahsulotlar
                </Link>
              </li>
              <li>
                <Link href="/catalog?ordering=-created_at" className="hover:text-indigo-600 transition-colors">
                  Yangi kelganlar
                </Link>
              </li>
              <li>
                <Link href="/catalog?in_stock=true" className="hover:text-indigo-600 transition-colors">
                  Mavjud tovarlar
                </Link>
              </li>
              <li>
                <Link href="/catalog?ordering=base_price" className="hover:text-indigo-600 transition-colors">
                  Aksiyalar & Chegirmalar
                </Link>
              </li>
            </ul>
          </div>

          {/* Mijozlarga */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Mijozlarga
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link href="/account/orders" className="hover:text-indigo-600 transition-colors">
                  Buyurtmani kuzatish
                </Link>
              </li>
              <li>
                <Link href="/account/profile" className="hover:text-indigo-600 transition-colors">
                  Shaxsiy kabinet
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-indigo-600 transition-colors">
                  Ko&apos;p beriladigan savollar
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-indigo-600 transition-colors">
                  Yetkazib berish shartlari
                </Link>
              </li>
            </ul>
          </div>

          {/* Kompaniya */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Kompaniya
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <Link href="/about" className="hover:text-indigo-600 transition-colors">
                  Biz haqimizda
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-indigo-600 transition-colors">
                  Bog&apos;lanish
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 transition-colors">
                  Foydalanish qoidalari
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
                  Maxfiylik siyosati
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; 2026 Ecommerce Platform. Barcha huquqlar himoyalangan.</p>
          <p>Toshkent shahar, O&apos;zbekiston</p>
        </div>
      </div>
    </footer>
  );
}
