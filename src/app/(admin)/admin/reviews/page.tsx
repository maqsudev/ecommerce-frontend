"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { adminService } from "@/features/admin/services/admin.service";
import { formatTimeAgo } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Review } from "@/types/reviews";

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();

  const [rejectModalReview, setRejectModalReview] = useState<Review | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin", "reviews", "pending"],
    queryFn: () => adminService.getPendingReviews(),
  });

  const moderateMutation = useMutation({
    mutationFn: ({
      reviewId,
      status,
      reason,
    }: {
      reviewId: number;
      status: "APPROVED" | "REJECTED";
      reason?: string;
    }) =>
      adminService.moderateReview(reviewId, {
        status,
        rejection_reason: reason,
      }),
    onSuccess: () => {
      toast.success("Sharh muvaffaqiyatli moderatsiya qilindi");
      setRejectModalReview(null);
      setRejectReason("");
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
    onError: () => {
      toast.error("Moderatsiya jarayonida xatolik yuz berdi");
    },
  });

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Sharhlar moderatsiyasi
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Foydalanuvchilar qoldirgan yangi fikr-mulohazalarni tekshirish va tasdiqlash
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-white border border-slate-200 animate-pulse"
              />
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((rev: Review) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs">
                    {rev.user?.name ? rev.user.name[0].toUpperCase() : "U"}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {rev.user?.name || "Xaridor"}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {formatTimeAgo(rev.created_at)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < rev.rating ? "fill-current" : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-800">{rev.title}</h5>
                <p className="text-xs text-slate-600 mt-1">{rev.comment}</p>
              </div>

              {(rev.pros || rev.cons) && (
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  {rev.pros && (
                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-800">
                      <strong>+:</strong> {rev.pros}
                    </div>
                  )}
                  {rev.cons && (
                    <div className="rounded-lg bg-rose-50 p-2 text-rose-800">
                      <strong>-:</strong> {rev.cons}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRejectModalReview(rev)}
                  className="gap-1 text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Rad etish</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    moderateMutation.mutate({
                      reviewId: rev.id,
                      status: "APPROVED",
                    })
                  }
                  className="gap-1 bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Tasdiqlash</span>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400">
            <MessageSquare className="h-10 w-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">
              Kutishdagi sharhlar mavjud emas
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Barcha foydalanuvchi sharhlari ko&apos;rib chiqilgan
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Sharhni rad etish sababi
            </h3>
            <textarea
              rows={3}
              placeholder="Masalan: Noto'g'ri so'zlar yoki spamlardan foydalanilgan"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-indigo-600"
            />
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectModalReview(null)}
              >
                Bekor qilish
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={moderateMutation.isPending}
                onClick={() =>
                  moderateMutation.mutate({
                    reviewId: rejectModalReview.id,
                    status: "REJECTED",
                    reason: rejectReason,
                  })
                }
              >
                Rad etish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
