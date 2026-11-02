import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShoppingBag, ShieldCheck, Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      {/* Left side: Brand Showcase (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-12 flex-col justify-between text-white overflow-hidden">
        {/* Subtle background decoration circles */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <ShoppingBag className="h-5 w-5 text-indigo-300" />
            </div>
            <span>Ecommerce Store</span>
          </Link>
        </div>

        {/* Main Pitch */}
        <div className="relative z-10 max-w-lg space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-xs font-medium">
            <Zap className="h-3.5 w-3.5 text-indigo-300" />
            Tezkor & Qulay Xaridlar
          </span>

          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Eng zamonaviy gadjetlar va qulay onlayn xaridlar olami
          </h2>

          <p className="text-indigo-200/90 text-base leading-relaxed">
            Biz bilan O&apos;zbekiston bo&apos;ylab 10 000+ dan ortiq original mahsulotlarni xarid qiling. Payme, Click va bo&apos;lib to&apos;lash imkoniyatlari mavjud.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-sm font-medium text-slate-200">24/7 Yetkazib berish</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 text-indigo-300 shrink-0" />
              <span className="text-sm font-medium text-slate-200">100% Rasmiy kafolat</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-indigo-300/80 pt-8 border-t border-white/10">
          <span>&copy; 2026 Ecommerce Platform Inc.</span>
          <span>Barcha huquqlar himoyalangan</span>
        </div>
      </div>

      {/* Right side: Auth Form Container */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        <div className="w-full max-w-md mx-auto">
          {/* Top navigation back button */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-200/60"
            >
              <ArrowLeft className="h-4 w-4" />
              Bosh sahifaga qaytish
            </Link>
          </div>

          {/* Active auth page */}
          {children}
        </div>
      </div>
    </div>
  );
}
