"use client";

import { useState } from "react";
import Link from "next/link";
import { User as UserIcon, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function RegisterPage() {
  const { register: registerUser, isRegistering } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    termsAccepted?: string;
  }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!formData.firstName.trim()) errs.firstName = "Ismingizni kiriting";
    if (!formData.lastName.trim()) errs.lastName = "Familiyangizni kiriting";
    if (!formData.email.trim()) errs.email = "Email kiritilishi shart";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Email formati noto'g'ri";
    if (!formData.termsAccepted)
      errs.termsAccepted = "Foydalanish shartlariga rozilik bildiring";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    registerUser({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
    });
  };

  return (
    <Card className="border-slate-200/90 shadow-xl shadow-slate-200/50">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold text-slate-900">
          Ro&apos;yxatdan o&apos;tish
        </CardTitle>
        <CardDescription className="text-slate-500">
          Parol eslab qolish shart emas — emailingizga bir martalik tasdiqlash kodi yuboriladi
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Info banner */}
        <div className="mb-5 flex items-start gap-3 rounded-xl bg-indigo-50/70 p-3.5 border border-indigo-100 text-xs text-indigo-900">
          <Sparkles className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
          <p>
            Ma&apos;lumotlaringizni kiriting. Email manzilingizga hisobni tasdiqlash uchun xavfsiz 6 xonali kod yuboriladi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Ism"
              placeholder="Ali"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              error={errors.firstName}
              leftIcon={<UserIcon className="h-4 w-4" />}
            />
            <Input
              label="Familiya"
              placeholder="Valiyev"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              error={errors.lastName}
            />
          </div>

          <Input
            label="Email manzili"
            type="email"
            placeholder="user@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            error={errors.email}
            helperText="Tasdiqlash kodi shu manzilga yuboriladi"
            leftIcon={<Mail className="h-4 w-4" />}
          />

          <div className="space-y-1 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) =>
                  setFormData({ ...formData, termsAccepted: e.target.checked })
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-600 leading-snug">
                Men platformaning{" "}
                <Link href="/terms" className="text-indigo-600 underline">
                  foydalanish shartlari
                </Link>{" "}
                va{" "}
                <Link href="/privacy" className="text-indigo-600 underline">
                  maxfiylik siyosatiga
                </Link>{" "}
                roziman.
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="text-xs text-rose-500 font-medium">
                {errors.termsAccepted}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-3"
            size="lg"
            isLoading={isRegistering}
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            Tasdiqlash kodini olish
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Hisobingiz bormi?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Tizimga kirish
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
