/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { XCircle, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { ISubscriptionRenew } from "@/types/subscriptionRenew";
import { useRejectRenewRequestMutation } from "@/redux/features/subscriptionRenew/subscriptionRenew.api";

const rejectSchema = z.object({
  rejectionReason: z
    .string()
    .min(10, "Please provide a reason of at least 10 characters")
    .max(500, "Reason must be under 500 characters"),
});

type RejectFormValues = z.infer<typeof rejectSchema>;

interface Props {
  request: ISubscriptionRenew | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubscriptionRenewRejectDialog({
  request,
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const [rejectRequest, { isLoading }] = useRejectRenewRequestMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema),
  });

  useEffect(() => {
    if (isOpen) reset({ rejectionReason: "" });
  }, [isOpen, reset]);

  if (!isOpen || !request) return null;

  const user = request.user as any;

  const onSubmit = async (values: RejectFormValues) => {
    try {
      await rejectRequest({
        id: request._id,
        data: { rejectionReason: values.rejectionReason },
      }).unwrap();

      toast.success("Renewal request rejected");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reject request");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isLoading ? onClose : undefined}
      />

      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-linear-to-r from-red-50 to-white dark:from-red-900/10 dark:to-gray-900">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Reject Renewal Request
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                for{" "}
                <span className="font-medium">
                  {user?.name ?? "this customer"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="px-6 py-5">
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5">
              Rejection Reason *
            </label>
            <textarea
              {...register("rejectionReason")}
              rows={4}
              placeholder="Explain why this renewal request is being rejected…"
              className={`
                w-full px-3 py-2.5 rounded-xl border bg-white dark:bg-gray-800 text-sm
                text-gray-800 dark:text-gray-200 placeholder:text-gray-400
                focus:outline-none focus:ring-2 transition-all resize-none
                ${errors.rejectionReason ? "border-red-400 focus:ring-red-500/30" : "border-gray-200 dark:border-gray-700 focus:ring-red-500/30 focus:border-red-400"}
              `}
            />
            {errors.rejectionReason && (
              <p className="mt-1 text-xs text-red-500">
                {errors.rejectionReason.message}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              This reason will be visible to the customer.
            </p>
          </div>

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
              className="flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Rejecting…
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Reject
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
