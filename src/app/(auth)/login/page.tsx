"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, KeyRound, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn, sendOtp, isSendingOtp } = useAuth();

  const [activeTab, setActiveTab] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validatePasswordForm = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = "Email kiritilishi shart";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Email formati noto'g'ri";
    if (!password) errs.password = "Parol kiritilishi shart";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateOtpForm = () => {
    const errs: { email?: string } = {};
    if (!email) errs.email = "Email kiritilishi shart";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Email formati noto'g'ri";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;
    login({ email, password });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOtpForm()) return;
    sendOtp(
      { email },
      {
        onSuccess: () => {
          router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        },
      }
    );
  };

  return (
    <Card className="border-slate-200/90 shadow-xl shadow-slate-200/50">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold text-slate-900">
          Tizimga kirish
        </CardTitle>
        <CardDescription className="text-slate-500">
          Shaxsiy kabinetingizga kirish usulini tanlang
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Method Switcher Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("password")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "password"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Parol bilan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("otp")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "otp"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            Bir martalik OTP
          </button>
        </div>

        {activeTab === "password" ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Email manzilingiz"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="Parol"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              leftIcon={<Lock className="h-4 w-4" />}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoggingIn}
            >
              Kirish
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <Input
              label="Email manzilingiz"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              helperText="Kiritilgan emailga 6 xonali tasdiqlash kodi yuboriladi"
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isSendingOtp}
            >
              <KeyRound className="h-4 w-4 mr-2" />
              Tasdiqlash kodini olish
            </Button>
          </form>
        )}

        {/* Footer Registration link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Hali akkauntingiz yo&apos;qmi?{" "}
            <Link
              href="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Ro&apos;yxatdan o&apos;tish
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
