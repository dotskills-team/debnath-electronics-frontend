/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  User,
  Mail,
  Phone,
  Store,
  CreditCard,
  Receipt,
  StickyNote,
  Clock,
  CheckCircle2,
  XCircle,
  ZoomIn,
  Check,
} from "lucide-react";
import { ISubscriptionRenew } from "@/types/subscriptionRenew";
import { formatDateTime, formatCurrency, getInitials, PAYMENT_METHOD_STYLES } from "@/utils/renewHelpers";
import { RenewStatusBadge } from "./RenewStatusBadge";

interface Props {
  request: ISubscriptionRenew | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (r: ISubscriptionRenew) => void;
  onReject: (r: ISubscriptionRenew) => void;
}

export function SubscriptionRenewDetailsModal({ request, isOpen, onClose, onApprove, onReject }: Props) {
  const [zoomImage, setZoomImage] = useState(false);

  if (!isOpen || !request) return null;

  const user = request.user as any;
  const pm = PAYMENT_METHOD_STYLES[request.paymentMethod];
  const currentPlan = user?.subscriptionPlan?.name ?? "No active plan";
  const currentExpiry = user?.subscriptionExpireAt;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl mt-8 mb-8">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 rounded-t-2xl z-10">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Renewal Request Details</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Submitted {formatDateTime(request.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <RenewStatusBadge status={request.status} />
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-6">

          {/* Customer Information */}
          <Section title="Customer Information" icon={User}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-sm font-bold text-amber-700 dark:text-amber-400 overflow-hidden shrink-0">
                {user?.picture ? (
                  <Image src={user.picture} alt={user?.name ?? ""} width={48} height={48} className="object-cover h-full w-full" />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.name ?? "Unknown"}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{user?.role ?? "Customer"}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow icon={Mail} label="Email" value={request.email || user?.email} />
              <InfoRow icon={Phone} label="Phone" value={user?.phone} />
              <InfoRow icon={Store} label="Store" value={user?.storeName ?? user?.shopName} />
            </div>
          </Section>

          {/* Subscription Information */}
          <Section title="Subscription Information" icon={CreditCard}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard label="Current Plan" value={currentPlan} />
              <InfoCard label="Current Expiry" value={currentExpiry ? formatDateTime(currentExpiry) : "Not active"} />
              {request.approvedPlan && (
                <InfoCard label="Requested / Approved Plan" value={(request as any).approvedPlan?.name ?? "—"} />
              )}
              {request?.approvedPrice !== undefined && request.status === "APPROVED" && (
                <InfoCard label="Approved Price" value={formatCurrency(request?.approvedPrice)} />
              )}
            </div>
          </Section>

          {/* Payment Information */}
          <Section title="Payment Information" icon={Receipt}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
                  Payment Method
                </p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${pm.bg} ${pm.text}`}>
                  {pm.label}
                </span>
              </div>
              <InfoCard label="Transaction ID" value={request.transactionId} mono />
            </div>

            {/* Screenshot */}
            {request.paymentScreenshot && (
              <div>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                  Payment Screenshot
                </p>
                <button
                  onClick={() => setZoomImage(true)}
                  className="relative w-full h-56 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 group"
                >
                  <Image
                    src={request.paymentScreenshot}
                    alt="Payment screenshot"
                    fill
                    className="object-contain bg-gray-50 dark:bg-gray-800"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                    <span className="flex items-center gap-1.5 text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-lg">
                      <ZoomIn className="h-3.5 w-3.5" />
                      Click to enlarge
                    </span>
                  </div>
                </button>
              </div>
            )}
          </Section>

          {/* Note */}
          {request.note && (
            <Section title="Customer Note" icon={StickyNote}>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl p-3 leading-relaxed">
                {request.note}
              </p>
            </Section>
          )}

          {/* Rejection reason */}
          {request.status === "REJECTED" && request.rejectionReason && (
            <Section title="Rejection Reason" icon={XCircle}>
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl p-3 leading-relaxed border border-red-200 dark:border-red-800">
                {request.rejectionReason}
              </p>
            </Section>
          )}

          {/* Status Timeline */}
          <Section title="Status Timeline" icon={Clock}>
            <div className="space-y-0">
              <TimelineItem
                icon={Clock}
                label="Request Submitted"
                time={formatDateTime(request.createdAt)}
                color="amber"
                isLast={request.status === "PENDING"}
              />
              {request.status === "APPROVED" && (
                <TimelineItem
                  icon={CheckCircle2}
                  label={`Approved by ${request.approvedBy?.name ?? "Admin"}`}
                  time={formatDateTime(request.approvedAt)}
                  color="emerald"
                  isLast
                />
              )}
              {request.status === "REJECTED" && (
                <TimelineItem
                  icon={XCircle}
                  label={`Rejected by ${request.approvedBy?.name ?? "Admin"}`}
                  time={formatDateTime(request.approvedAt)}
                  color="red"
                  isLast
                />
              )}
            </div>
          </Section>
        </div>

        {/* Footer actions */}
        {request.status === "PENDING" && (
          <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 sticky bottom-0 bg-white dark:bg-gray-900 rounded-b-2xl">
            <button
              onClick={() => { onClose(); onReject(request); }}
              className="flex-1 h-10 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              Reject
            </button>
            <button
              onClick={() => { onClose(); onApprove(request); }}
              className="flex-1 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Check className="h-4 w-4" />
              Approve Subscription
            </button>
          </div>
        )}
      </div>

      {/* Zoomed screenshot */}
      {zoomImage && request.paymentScreenshot && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-6 bg-black/90"
          onClick={() => setZoomImage(false)}
        >
          <button
            onClick={() => setZoomImage(false)}
            className="absolute top-5 right-5 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative w-full h-full max-w-3xl max-h-[85vh]">
            <Image
              src={request.paymentScreenshot}
              alt="Payment screenshot"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-amber-500" />
        <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
      <span className="text-gray-500 dark:text-gray-400">{label}:</span>
      <span className="text-gray-700 dark:text-gray-300 font-medium truncate">{value || "—"}</span>
    </div>
  );
}

function InfoCard({ label, value, mono = false }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
      <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-sm font-semibold text-gray-800 dark:text-gray-200 truncate ${mono ? "font-mono" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}

function TimelineItem({
  icon: Icon,
  label,
  time,
  color,
  isLast,
}: {
  icon: React.ElementType;
  label: string;
  time: string;
  color: "amber" | "emerald" | "red";
  isLast: boolean;
}) {
  const colorMap = {
    amber: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
    red: "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400",
  };

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${colorMap[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
        {!isLast && <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 my-1" />}
      </div>
      <div className="pb-4">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
}