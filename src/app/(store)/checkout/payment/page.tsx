"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreditCard, ExternalLink, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import apiClient from "@/lib/api-client";
import { InitializePaymentResponse, PaymentProvider } from "@/types/payments";
import { toast } from "sonner";

function CheckoutPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "";

  const [provider, setProvider] = useState<PaymentProvider>("PAYME");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<InitializePaymentResponse | null>(null);

  useEffect(() => {
    if (!orderNumber) {
      router.push("/");
    }
  }, [orderNumber, router]);

  const handleInitPayment = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.post<InitializePaymentResponse>(
        "/api/v1/payments/initialize/",
        {
          order_number: orderNumber,
          provider,
          return_url: `${window.location.origin}/checkout/success?order=${orderNumber}`,
        }
      );
      setPaymentData(res.data);
      setIsLoading(false);

      if (res.data.payment_url) {
        window.location.href = res.data.payment_url;
      }
    } catch {
      setIsLoading(false);
      toast.error("To'lovni boshlashda xatolik yuz berdi");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <Card className="border-slate-200/90 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <CreditCard className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">
            Onlayn to&apos;lovni amalga oshirish
          </CardTitle>
          <CardDescription>
            Buyurtma: <span className="font-mono font-bold text-slate-800">{orderNumber}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              To&apos;lov tizimini tanlang:
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProvider("PAYME")}
                className={`p-4 rounded-xl border text-center transition-all font-bold text-sm ${
                  provider === "PAYME"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                Payme
              </button>
              <button
                type="button"
                onClick={() => setProvider("CLICK")}
                className={`p-4 rounded-xl border text-center transition-all font-bold text-sm ${
                  provider === "CLICK"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                Click Up
              </button>
            </div>
          </div>

          <Button
            onClick={handleInitPayment}
            isLoading={isLoading}
            size="lg"
            className="w-full shadow-md shadow-indigo-200"
          >
            <span>{provider} orqali to&apos;lash</span>
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => router.push(`/checkout/success?order=${orderNumber}`)}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Keyinroq to&apos;lash (Kuzatuv sahifasiga o&apos;tish)
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>256-bit SSL xavfsiz to&apos;lov shlyuzi</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto p-12 text-center text-slate-400">
          Yuklanmoqda...
        </div>
      }
    >
      <CheckoutPaymentContent />
    </Suspense>
  );
}
