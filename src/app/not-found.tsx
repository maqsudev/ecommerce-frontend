import Link from "next/link";
import { ShoppingBag, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 mb-6 shadow-sm">
        <ShoppingBag className="h-12 w-12" />
      </div>
      <span className="font-mono text-5xl font-black text-indigo-600">404</span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
        Sahifa topilmadi
      </h1>
      <p className="text-sm text-slate-500 max-w-md mt-2 mb-8">
        Siz qidirayotgan sahifa o&apos;chirilgan, manzili o&apos;zgargan yoki vaqtincha mavjud emas bo&apos;lishi mumkin.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/">
          <Button size="lg" className="gap-2">
            <Home className="h-4 w-4" />
            <span>Bosh sahifaga qaytish</span>
          </Button>
        </Link>
        <Link href="/catalog">
          <Button variant="outline" size="lg" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Katalogga o&apos;tish</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
