"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, PackageCheck, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "ORD-20261102-1001";

  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-md">
        <CheckCircle2 className="h-12 w-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Muvaffaqiyatli qabul qilindi
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Xaridingiz uchun tashakkur!
        </h1>
        <p className="text-sm text-slate-500">
          Sizning buyurtmangiz rasmiylashtirildi va tez orada operatorlarimiz tomonidan tasdiqlanadi.
        </p>
      </div>

      {/* Order Number Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-center">
        <p className="text-xs text-slate-400">Buyurtma raqami:</p>
        <p className="text-xl font-mono font-black text-indigo-600 mt-1">
          {orderNumber}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <Link href={`/account/orders/${orderNumber}`}>
          <Button size="lg" className="gap-2 w-full sm:w-auto">
            <PackageCheck className="h-4 w-4" />
            <span>Buyurtmani kuzatish</span>
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
            <Home className="h-4 w-4" />
            <span>Bosh sahifaga qaytish</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto p-12 text-center text-slate-400">
          Yuklanmoqda...
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
