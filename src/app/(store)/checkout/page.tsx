"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Truck,
  CreditCard,
  Tag,
  ShieldCheck,
  Check,
  ArrowRight,
  ShoppingBag,
  Banknote,
  Smartphone,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCheckout } from "@/features/orders/hooks/useOrders";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShippingMethod, PaymentMethod, ShippingAddress } from "@/types/orders";
import { toast } from "sonner";

const UZBEKISTAN_REGIONS = [
  "Toshkent shahri",
  "Toshkent viloyati",
  "Samarqand viloyati",
  "Buxoro viloyati",
  "Farg'ona viloyati",
  "Andijon viloyati",
  "Namangan viloyati",
  "Qashqadaryo viloyati",
  "Surxondaryo viloyati",
  "Xorazm viloyati",
  "Navoiy viloyati",
  "Jizzax viloyati",
  "Sirdaryo viloyati",
  "Qoraqalpog'iston Respublikasi",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, fetchCart } = useCartStore();
  const { user } = useAuth();
  const {
    getPreview,
    previewData,
    isPreviewLoading,
    validateCoupon,
    isValidatingCoupon,
    createOrder,
    isCreatingOrder,
  } = useCheckout();

  // Address state
  const [address, setAddress] = useState<ShippingAddress>({
    recipient_name: user ? `${user.first_name} ${user.last_name}`.trim() : "",
    phone_number: user?.phone_number || "+998",
    alternative_phone_number: "",
    region: "Toshkent shahri",
    district: "",
    street_address: "",
    apartment_office: "",
    postal_code: "",
    landmark: "",
    delivery_instructions: "",
  });

  // Shipping & Payment Method
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("STANDARD");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH_ON_DELIVERY");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [customerNotes, setCustomerNotes] = useState("");

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Update preview whenever region, shippingMethod, or appliedCoupon changes
  useEffect(() => {
    if (cart && cart.items?.length > 0) {
      getPreview({
        shipping_method: shippingMethod,
        region: address.region,
        coupon_code: appliedCoupon || undefined,
      }).catch(() => {});
    }
  }, [cart, shippingMethod, address.region, appliedCoupon, getPreview]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      const res = await validateCoupon({
        code: couponCode.trim(),
        subtotal: cart?.subtotal || "0",
      });
      if (res.valid) {
        setAppliedCoupon(couponCode.trim());
        toast.success(res.message || "Kupon muvaffaqiyatli qo'llandi!");
      } else {
        toast.error(res.message || "Kupon yaroqsiz");
      }
    } catch {
      toast.error("Kuponni tekshirishda xatolik yuz berdi");
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.recipient_name.trim()) {
      toast.error("Qabul qiluvchi ismini kiriting");
      return;
    }
    if (!address.phone_number || address.phone_number.length < 9) {
      toast.error("Telefon raqamini to'liq kiriting");
      return;
    }
    if (!address.street_address.trim()) {
      toast.error("Yetkazib berish manzilini (ko'cha, uy) kiriting");
      return;
    }

    createOrder({
      shipping_address: address,
      shipping_method: shippingMethod,
      payment_method: paymentMethod,
      coupon_code: appliedCoupon || undefined,
      customer_notes: customerNotes || undefined,
    });
  };

  const items = cart?.items || [];
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">
          Savatda tovarlar mavjud emas
        </h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Buyurtma rasmiylashtirish uchun savatingizga mahsulot qo&apos;shing
        </p>
        <Link href="/catalog">
          <Button size="md">Katalogga o&apos;tish</Button>
        </Link>
      </div>
    );
  }

  const subtotal = previewData?.subtotal ?? cart?.subtotal ?? 0;
  const shippingFee = previewData?.shipping_fee ?? 25000;
  const discount = previewData?.discount ?? cart?.discount ?? 0;
  const grandTotal = previewData?.grand_total ?? Number(subtotal) + Number(shippingFee) - Number(discount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Buyurtmani rasmiylashtirish
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Yetkazib berish manzili va to&apos;lov turini tanlang
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Form: Address, Shipping, Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Address */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs">
                    1
                  </div>
                  <CardTitle className="text-base">
                    Yetkazib berish manzili
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Qabul qiluvchi ismi va familiyasi"
                    placeholder="Alisher Navoiy"
                    value={address.recipient_name}
                    onChange={(e) =>
                      setAddress({ ...address, recipient_name: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Telefon raqami"
                    type="tel"
                    placeholder="+998 90 123 45 67"
                    value={address.phone_number}
                    onChange={(e) =>
                      setAddress({ ...address, phone_number: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Viloyat / Shahar
                    </label>
                    <select
                      value={address.region}
                      onChange={(e) =>
                        setAddress({ ...address, region: e.target.value })
                      }
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-indigo-600"
                    >
                      {UZBEKISTAN_REGIONS.map((reg) => (
                        <option key={reg} value={reg}>
                          {reg}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Tuman"
                    placeholder="Masalan: Mirabod tumani"
                    value={address.district}
                    onChange={(e) =>
                      setAddress({ ...address, district: e.target.value })
                    }
                  />
                </div>

                <Input
                  label="Aniq manzil (Ko'cha, uy raqami)"
                  placeholder="Amir Temur shoh ko'chasi, 15-uy"
                  value={address.street_address}
                  onChange={(e) =>
                    setAddress({ ...address, street_address: e.target.value })
                  }
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Kvartira / Ofis (ixtiyoriy)"
                    placeholder="24-xonadon"
                    value={address.apartment_office || ""}
                    onChange={(e) =>
                      setAddress({ ...address, apartment_office: e.target.value })
                    }
                  />
                  <Input
                    label="Mo'ljal (Landmark)"
                    placeholder="Oybek metro bekati yonida"
                    value={address.landmark || ""}
                    onChange={(e) =>
                      setAddress({ ...address, landmark: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Shipping Method */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs">
                    2
                  </div>
                  <CardTitle className="text-base">
                    Yetkazib berish usuli
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    shippingMethod === "STANDARD"
                      ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping_method"
                      checked={shippingMethod === "STANDARD"}
                      onChange={() => setShippingMethod("STANDARD")}
                      className="text-indigo-600"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Standart yetkazib berish
                      </p>
                      <p className="text-xs text-slate-500">
                        1-2 ish kuni ichida kuryer orqali
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    25 000 so&apos;m
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    shippingMethod === "EXPRESS"
                      ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping_method"
                      checked={shippingMethod === "EXPRESS"}
                      onChange={() => setShippingMethod("EXPRESS")}
                      className="text-indigo-600"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Tezkor Express yetkazish
                      </p>
                      <p className="text-xs text-slate-500">
                        Buyurtma qilingan kunning o&apos;zida (3-5 soat)
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    50 000 so&apos;m
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    shippingMethod === "PICKUP"
                      ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping_method"
                      checked={shippingMethod === "PICKUP"}
                      onChange={() => setShippingMethod("PICKUP")}
                      className="text-indigo-600"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Do&apos;kondan olib ketish (Samovivoz)
                      </p>
                      <p className="text-xs text-slate-500">
                        Toshkent shahridagi tarqatish markazimizdan
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">
                    Bepul
                  </span>
                </label>
              </CardContent>
            </Card>

            {/* Step 3: Payment Method */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold text-xs">
                    3
                  </div>
                  <CardTitle className="text-base">To&apos;lov usuli</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "CASH_ON_DELIVERY"
                      ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === "CASH_ON_DELIVERY"}
                    onChange={() => setPaymentMethod("CASH_ON_DELIVERY")}
                    className="text-indigo-600"
                  />
                  <Banknote className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Naqd pul yoki karta orqali qabul qilganda
                    </p>
                    <p className="text-xs text-slate-500">
                      Tovarni ko&apos;rib, tekshirib olgandan so&apos;ng to&apos;lang
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "PAYME"
                      ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === "PAYME"}
                    onChange={() => setPaymentMethod("PAYME")}
                    className="text-indigo-600"
                  />
                  <CreditCard className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Payme orqali onlayn to&apos;lov
                    </p>
                    <p className="text-xs text-slate-500">
                      Uzcard yoki Humo kartasi orqali to&apos;lash
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "CLICK"
                      ? "border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === "CLICK"}
                    onChange={() => setPaymentMethod("CLICK")}
                    className="text-indigo-600"
                  />
                  <Smartphone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Click Up orqali onlayn to&apos;lov
                    </p>
                    <p className="text-xs text-slate-500">
                      Click ilovasi yoki veb-sayti orqali tezkor to&apos;lash
                    </p>
                  </div>
                </label>
              </CardContent>
            </Card>

            {/* Customer Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  Kuryer uchun qo&apos;shimcha izoh (ixtiyoriy)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  rows={2}
                  placeholder="Masalan: Soat 14:00 dan keyin yetkazing yoki domofon kodi: 45"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-indigo-600"
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Summary & Coupon */}
          <div className="space-y-6 sticky top-24">
            {/* Promo Coupon Box */}
            <Card>
              <CardContent className="pt-6">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Promokod / Kupon kodi
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masalan: SAVE20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 h-10 px-3 uppercase font-mono text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleApplyCoupon}
                    isLoading={isValidatingCoupon}
                  >
                    Qo&apos;llash
                  </Button>
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    Kupon &quot;{appliedCoupon}&quot; faollashtirildi
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Order Preview Breakdown */}
            <Card className="border-slate-200/90 shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Sizning buyurtmangiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mini items list */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1 text-xs">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <span className="line-clamp-1 flex-1 text-slate-700">
                        {item.product?.name || item.variant?.name} &times; {item.quantity}
                      </span>
                      <span className="font-semibold text-slate-900 ml-2">
                        {formatCurrency(item.total_price)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Mahsulotlar summasi:</span>
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yetkazib berish narxi:</span>
                    <span className="font-semibold text-slate-800">
                      {shippingMethod === "PICKUP"
                        ? "Bepul"
                        : formatCurrency(shippingFee)}
                    </span>
                  </div>
                  {Number(discount) > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Chegirma:</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-bold text-slate-900">
                    <span>Jami to&apos;lov:</span>
                    <span className="text-2xl font-black text-indigo-600">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-4 shadow-md shadow-indigo-200"
                  isLoading={isCreatingOrder}
                >
                  <span>Buyurtmani tasdiqlash</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center pt-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Xavfsiz va kafolatlangan buyurtma</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
