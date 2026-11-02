"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Calendar, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatDate, formatPhoneNumber } from "@/lib/formatters";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, refetchUser } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setPhone(user.phone_number || "");
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    toast.success("Profil ma'lumotlari muvaffaqiyatli saqlandi!");
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Shaxsiy ma&apos;lumotlar</CardTitle>
              <CardDescription>
                Profilingizni boshqaring va yangilang
              </CardDescription>
            </div>
            {user?.is_staff && (
              <Badge variant="default" className="gap-1.5 py-1 px-3">
                <ShieldCheck className="h-3.5 w-3.5" />
                Administrator
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ismingiz"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                leftIcon={<User className="h-4 w-4" />}
              />
              <Input
                label="Familiyangiz"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email manzili"
                type="email"
                value={user?.email || ""}
                disabled
                helperText="Email manzilini o'zgartirish uchun mijozlar xizmati bilan bog'laning"
                leftIcon={<Mail className="h-4 w-4" />}
              />
              <Input
                label="Telefon raqami"
                type="tel"
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="h-4 w-4" />}
              />
            </div>

            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex items-center gap-3 text-xs text-slate-500">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>
                Ro&apos;yxatdan o&apos;tgan sana:{" "}
                <strong className="text-slate-700">
                  {user?.date_joined ? formatDate(user.date_joined) : "Yaqinda"}
                </strong>
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" size="md">
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-emerald-300" />
                    Saqlandi
                  </>
                ) : (
                  "O'zgarishlarni saqlash"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
