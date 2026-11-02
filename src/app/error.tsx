"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 mb-6 shadow-sm">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
        Kutilmagan xatolik yuz berdi
      </h1>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-8">
        Sahifani qayta yuklab ko&apos;ring yoki bosh sahifaga qayting. Muammo takrorlansa texnik xizmat bilan bog&apos;laning.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={() => reset()} size="lg" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          <span>Qayta urinib ko&apos;rish</span>
        </Button>
        <Link href="/">
          <Button variant="outline" size="lg" className="gap-2">
            <Home className="h-4 w-4" />
            <span>Bosh sahifa</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
