"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Plus, Trash2, CheckCircle2, ShieldCheck, KeyRound } from "lucide-react";
import { paymentsService } from "@/features/payments/services/payments.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SavedCard } from "@/types/payments";

export default function SavedCardsPage() {
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [pendingCardId, setPendingCardId] = useState<number | null>(null);

  const { data: cards, isLoading } = useQuery({
    queryKey: ["payments", "cards"],
    queryFn: () => paymentsService.getSavedCards(),
  });

  const addCardMutation = useMutation({
    mutationFn: () =>
      paymentsService.addCard({
        card_number: cardNumber.replace(/\s/g, ""),
        expire_date: expireDate,
      }),
    onSuccess: (data) => {
      setPendingCardId(data.card_id);
      setIsOtpStep(true);
      toast.info("Telefoningizga SMS tasdiqlash kodi yuborildi");
    },
    onError: () => {
      toast.error("Karta ma'lumotlari noto'g'ri yoki qabul qilinmadi");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: () => {
      if (!pendingCardId) throw new Error("Card ID topilmadi");
      return paymentsService.verifyCardOtp(pendingCardId, otpCode);
    },
    onSuccess: () => {
      toast.success("Karta muvaffaqiyatli saqlandi!");
      setIsAddModalOpen(false);
      setIsOtpStep(false);
      setCardNumber("");
      setExpireDate("");
      setOtpCode("");
      queryClient.invalidateQueries({ queryKey: ["payments", "cards"] });
    },
    onError: () => {
      toast.error("Kiritilgan SMS kod noto'g'ri");
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (cardId: number) => paymentsService.deleteCard(cardId),
    onSuccess: () => {
      toast.success("Karta o'chirildi");
      queryClient.invalidateQueries({ queryKey: ["payments", "cards"] });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (cardId: number) => paymentsService.setDefaultCard(cardId),
    onSuccess: () => {
      toast.success("Asosiy to'lov kartasi yangilandi");
      queryClient.invalidateQueries({ queryKey: ["payments", "cards"] });
    },
  });

  // Card number formatter
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Expiration formatter (MM/YY)
  const handleExpireDateChange = (val: string) => {
    const raw = val.replace(/\D/g, "").slice(0, 4);
    if (raw.length > 2) {
      setExpireDate(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpireDate(raw);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Saqlangan bank kartalari
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tezkor 1-Click to&apos;lovlar uchun kartalaringizni ulang
          </p>
        </div>

        <Button
          onClick={() => {
            setIsAddModalOpen(true);
            setIsOtpStep(false);
          }}
          size="sm"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Yangi karta qo&apos;shish</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-44 rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-44 rounded-2xl bg-slate-200 animate-pulse" />
        </div>
      ) : cards && cards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((card: SavedCard) => (
            <div
              key={card.id}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-lg flex flex-col justify-between h-48 border border-white/10"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-bold tracking-widest text-indigo-200">
                  {card.card_type || "UZCARD"}
                </span>
                {card.is_default && (
                  <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                    Asosiy karta
                  </Badge>
                )}
              </div>

              <div>
                <p className="font-mono text-lg tracking-widest text-white font-bold">
                  {card.card_number}
                </p>
                <div className="flex justify-between items-center text-xs text-indigo-200/80 mt-2">
                  <span>Muddati: {card.expire_date}</span>
                  {card.card_holder && <span>{card.card_holder}</span>}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/10 text-xs">
                {!card.is_default ? (
                  <button
                    type="button"
                    onClick={() => setDefaultMutation.mutate(card.id)}
                    className="text-indigo-300 hover:text-white underline text-[11px]"
                  >
                    Asosiy qilib belgilash
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Standart
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => deleteCardMutation.mutate(card.id)}
                  className="text-rose-400 hover:text-rose-300 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
          <CreditCard className="h-10 w-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">
            Hozircha saqlangan kartalar mavjud emas
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Har safar karta kiritmaslik uchun Uzcard yoki Humo kartangizni saqlab qo&apos;ying
          </p>
        </div>
      )}

      {/* Add Card Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {isOtpStep ? "SMS tasdiqlash" : "Yangi bank kartasi ulash"}
            </h3>

            {!isOtpStep ? (
              <div className="space-y-4">
                <Input
                  label="Karta raqami (16 xonali)"
                  placeholder="8600 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  leftIcon={<CreditCard className="h-4 w-4" />}
                />
                <Input
                  label="Amal qilish muddati (OO/YY)"
                  placeholder="12/28"
                  value={expireDate}
                  onChange={(e) => handleExpireDateChange(e.target.value)}
                />
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Bekor qilish
                  </Button>
                  <Button
                    size="sm"
                    disabled={cardNumber.replace(/\s/g, "").length < 16 || expireDate.length < 5}
                    isLoading={addCardMutation.isPending}
                    onClick={() => addCardMutation.mutate()}
                  >
                    SMS kod olish
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Kartaga ulangan telefon raqamingizga yuborilgan 6 xonali SMS kodni kiriting:
                </p>
                <Input
                  label="SMS OTP Kodi"
                  placeholder="123456"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  leftIcon={<KeyRound className="h-4 w-4" />}
                />
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOtpStep(false)}
                  >
                    Ortga
                  </Button>
                  <Button
                    size="sm"
                    disabled={otpCode.length < 4}
                    isLoading={verifyOtpMutation.isPending}
                    onClick={() => verifyOtpMutation.mutate()}
                  >
                    Tasdiqlash va saqlash
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
