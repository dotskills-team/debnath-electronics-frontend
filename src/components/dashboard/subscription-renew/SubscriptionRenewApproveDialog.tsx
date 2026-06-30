/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { ISubscriptionRenew } from "@/types/subscriptionRenew";
import { useApproveRenewRequestMutation } from "@/redux/features/subscriptionRenew/subscriptionRenew.api";
import { useGetAllPlansQuery } from "@/redux/features/plan/plan.api";

const approveSchema = z.object({
  planId: z.string().min(1, "Please select a plan"),
  durationInDays: z.coerce.number().min(1, "Duration must be at least 1 day").optional(),
  customPrice: z.coerce.number().min(0, "Price cannot be negative").optional(),
  adminNote: z.string().optional(),
});

type ApproveFormValues = z.infer<typeof approveSchema>;

interface Props {
  request: ISubscriptionRenew | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubscriptionRenewApproveDialog({ request, isOpen, onClose, onSuccess }: Props) {
  const [showSuccess, setShowSuccess] = useState(false);
  const { data: plansData } = useGetAllPlansQuery({ limit: 100 } as any);
  const plans = (plansData as any)?.data ?? [];
  const [approveRequest, { isLoading }] = useApproveRenewRequestMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ApproveFormValues>({
    resolver: zodResolver(approveSchema as any),
  });

  const selectedPlanId = watch("planId");
  const selectedPlan = plans.find((p: any) => p._id === selectedPlanId);

  useEffect(() => {
    if (isOpen) {
      reset({ planId: "", durationInDays: undefined, customPrice: undefined, adminNote: "" });
      setShowSuccess(false);
    }
  }, [isOpen, reset]);

  if (!isOpen || !request) return null;

  const user = request.user as any;

  const onSubmit = async (values: ApproveFormValues) => {
    try {
      await approveRequest({
        id: request._id,
        data: {
          planId: values.planId,
          durationInDays: values.durationInDays,
          customPrice: values.customPrice,
        },
      }).unwrap();

      setShowSuccess(true);
      toast.success("Subscription approved successfully!");

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve request");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!isLoading ? onClose : undefined} />

      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md overflow-hidden">

        {showSuccess ? (
          // Success animation state
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-emerald-400/30 blur-2xl rounded-full animate-pulse" />
              <div className="relative h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center animate-[scaleIn_0.4s_ease-out]">
                <CheckCircle2 className="h-9 w-9 text-emerald-500" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Subscription Approved!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.name}&rsquo;s subscription has been activated.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-linear-to-r from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-900">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">Approve Subscription</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    for <span className="font-medium">{user?.name ?? "this customer"}</span>
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="px-6 py-5 space-y-4">

                {/* Plan select */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                    Select Plan *
                  </label>
                  <select
                    {...register("planId")}
                    className={`
                      w-full h-10 px-3 rounded-xl border bg-white dark:bg-gray-800 text-sm
                      text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2
                      transition-all appearance-none cursor-pointer
                      ${errors.planId ? "border-red-400 focus:ring-red-500/30" : "border-gray-200 dark:border-gray-700 focus:ring-amber-500/30 focus:border-amber-500"}
                    `}
                  >
                    <option value="">Choose a subscription plan…</option>
                    {plans.map((p: any) => (
                      <option key={p._id} value={p._id}>
                        {p.name} — ৳{p.price} / {p.durationInDays} days
                      </option>
                    ))}
                  </select>
                  {errors.planId && <p className="mt-1 text-xs text-red-500">{errors.planId.message}</p>}
                </div>

                {/* Duration override */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                    Duration (days)
                    <span className="ml-1.5 text-gray-400 normal-case font-normal">
                      {selectedPlan ? `default: ${selectedPlan.durationInDays}` : "optional override"}
                    </span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder={selectedPlan ? String(selectedPlan.durationInDays) : "e.g. 30"}
                    {...register("durationInDays")}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                  {errors.durationInDays && <p className="mt-1 text-xs text-red-500">{errors.durationInDays.message}</p>}
                </div>

                {/* Custom price override */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                    Custom Price (৳)
                    <span className="ml-1.5 text-gray-400 normal-case font-normal">
                      {selectedPlan ? `default: ৳${selectedPlan.price}` : "optional override"}
                    </span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder={selectedPlan ? String(selectedPlan.price) : "e.g. 999"}
                    {...register("customPrice")}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                  />
                  {errors.customPrice && <p className="mt-1 text-xs text-red-500">{errors.customPrice.message}</p>}
                </div>

                {/* Optional admin note */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
                    Admin Note (optional)
                  </label>
                  <textarea
                    {...register("adminNote")}
                    rows={2}
                    placeholder="Internal note about this approval…"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Approving…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Approve Subscription
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}