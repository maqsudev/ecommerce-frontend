"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const { verifyOtp, isVerifyingOtp, sendOtp, isSendingOtp } = useAuth();

  const [email] = useState(emailParam);
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!emailParam) {
      router.push("/login");
    }
  }, [emailParam, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric inputs
    const char = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto focus next input
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setDigits(newDigits);
    const nextIdx = Math.min(pasteData.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== 6) return;

    verifyOtp({ email, code });
  };

  const handleResend = () => {
    if (countdown > 0 || isSendingOtp) return;
    sendOtp(
      { email },
      {
        onSuccess: () => {
          setCountdown(60);
          setDigits(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        },
      }
    );
  };

  const isComplete = digits.every((d) => d.length === 1);

  return (
    <Card className="border-slate-200/90 shadow-xl shadow-slate-200/50">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
          <KeyRound className="h-6 w-6" />
        </div>
        <CardTitle className="text-2xl font-bold text-slate-900">
          Kodni tasdiqlang
        </CardTitle>
        <CardDescription className="text-slate-500">
          <span className="font-semibold text-slate-800">{email}</span> manziliga 6 xonali tasdiqlash kodi yuborildi.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 6 Digit Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="h-13 w-11 sm:h-14 sm:w-12 text-center text-xl font-bold rounded-xl border border-slate-200 bg-white shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!isComplete}
            isLoading={isVerifyingOtp}
          >
            Tasdiqlash va Kirish
          </Button>

          {/* Resend Code Section */}
          <div className="text-center pt-2">
            {countdown > 0 ? (
              <p className="text-xs text-slate-500">
                Kodni qayta yuborish:{" "}
                <span className="font-semibold text-indigo-600">{countdown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isSendingOtp}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSendingOtp ? "animate-spin" : ""}`} />
                Kodni qayta yuborish
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Boshqa email bilan kirish
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <Card className="p-8 text-center text-slate-500">
          Yuklanmoqda...
        </Card>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
