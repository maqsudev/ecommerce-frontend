"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, ThumbsUp, CheckCircle, MessageSquarePlus, CornerDownRight } from "lucide-react";
import { reviewsService } from "../services/reviews.service";
import { formatTimeAgo } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ProductReviewsProps {
  productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");

  const { data: summary } = useQuery({
    queryKey: ["reviews", "summary", productId],
    queryFn: () => reviewsService.getRatingSummary(productId),
    enabled: !!productId,
  });

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["reviews", "list", productId],
    queryFn: () => reviewsService.getProductReviews(productId),
    enabled: !!productId,
  });

  const createReviewMutation = useMutation({
    mutationFn: () =>
      reviewsService.createReview(productId, {
        rating,
        title,
        comment,
        pros,
        cons,
      }),
    onSuccess: () => {
      toast.success("Sharhingiz moderatsiyaga yuborildi!");
      setIsModalOpen(false);
      setTitle("");
      setComment("");
      setPros("");
      setCons("");
      queryClient.invalidateQueries({ queryKey: ["reviews", "list", productId] });
    },
    onError: () => {
      toast.error("Sharh qoldirishda xatolik yuz berdi");
    },
  });

  const voteMutation = useMutation({
    mutationFn: (reviewId: number) =>
      reviewsService.voteReview(reviewId, { vote_type: "HELPFUL" }),
    onSuccess: () => {
      toast.success("Ovozingiz qabul qilindi!");
      queryClient.invalidateQueries({ queryKey: ["reviews", "list", productId] });
    },
  });

  const reviews = reviewsData?.results || [];

  return (
    <div className="space-y-8">
      {/* Top Summary Banner */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Average Rating */}
          <div className="text-center md:border-r md:border-slate-100 pr-4">
            <span className="text-5xl font-black text-slate-900 tracking-tight">
              {summary?.average_rating ? summary.average_rating.toFixed(1) : "5.0"}
            </span>
            <div className="flex items-center justify-center gap-1 text-amber-400 my-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-500">
              {summary?.total_reviews ?? reviews.length} ta sharh asosida
            </p>
          </div>

          {/* Rating Distribution Bars */}
          <div className="space-y-1.5 md:col-span-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary?.distribution?.[star as 1 | 2 | 3 | 4 | 5] ?? 0;
              const total = summary?.total_reviews || 1;
              const percent = Math.round((count / total) * 100);

              return (
                <div key={star} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-4 font-semibold">{star}</span>
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-slate-400">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="text-center md:text-right">
            <Button
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error("Sharh qoldirish uchun tizimga kiring");
                  return;
                }
                setIsModalOpen(true);
              }}
              size="md"
            >
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              Sharh qoldirish
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs">
                    {rev.user?.name ? rev.user.name[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {rev.user?.name || "Xaridor"}
                      </h4>
                      {rev.is_verified_purchase && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                          <CheckCircle className="h-3 w-3" />
                          Tekshirilgan xaridor
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {formatTimeAgo(rev.created_at)}
                    </p>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rev.rating ? "fill-current" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Content */}
              <div>
                <h5 className="text-sm font-bold text-slate-800">{rev.title}</h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              {/* Pros & Cons */}
              {(rev.pros || rev.cons) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                  {rev.pros && (
                    <div className="rounded-lg bg-emerald-50/60 p-2.5 text-emerald-800">
                      <strong className="font-semibold block mb-0.5">Afzalliklari:</strong>
                      {rev.pros}
                    </div>
                  )}
                  {rev.cons && (
                    <div className="rounded-lg bg-rose-50/60 p-2.5 text-rose-800">
                      <strong className="font-semibold block mb-0.5">Kamchiliklari:</strong>
                      {rev.cons}
                    </div>
                  )}
                </div>
              )}

              {/* Store Official Reply */}
              {rev.reply && (
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex gap-2.5 text-xs text-slate-700 mt-2">
                  <CornerDownRight className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-indigo-900 block mb-0.5">
                      {rev.reply.author || "Do'kon ma'muriyati"}:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {rev.reply.comment}
                    </p>
                  </div>
                </div>
              )}

              {/* Helpful Votes */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => voteMutation.mutate(rev.id)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>Foydali ({rev.helpful_votes ?? 0})</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-white text-slate-400 text-xs">
            Ushbu mahsulotga hali sharh qoldirilmagan. Birinchi bo&apos;lib fikr bildiring!
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Sharh qoldirish</h3>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700">Baholash</span>
              <div className="flex gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? "fill-current" : "text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Sarlavha"
              placeholder="Masalan: Juda ajoyib smartfon!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Batafsil sharhingiz
              </label>
              <textarea
                rows={3}
                placeholder="Mahsulot haqidagi taassurotlaringiz..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Afzalliklari (ixtiyoriy)"
                placeholder="Kamera, Batareya"
                value={pros}
                onChange={(e) => setPros(e.target.value)}
              />
              <Input
                label="Kamchiliklari (ixtiyoriy)"
                placeholder="Narxi, Og'irligi"
                value={cons}
                onChange={(e) => setCons(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(false)}
              >
                Bekor qilish
              </Button>
              <Button
                size="sm"
                isLoading={createReviewMutation.isPending}
                onClick={() => createReviewMutation.mutate()}
                disabled={!title || !comment}
              >
                Yuborish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
