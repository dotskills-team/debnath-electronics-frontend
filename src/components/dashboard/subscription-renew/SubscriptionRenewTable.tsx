/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Eye, Check, X, ImageOff } from "lucide-react";
import { ISubscriptionRenew } from "@/types/subscriptionRenew";
import {
  PAYMENT_METHOD_STYLES,
  formatDate,
  getInitials,
} from "@/utils/renewHelpers";
import { RenewStatusBadge } from "./RenewStatusBadge";

interface Props {
  requests: ISubscriptionRenew[];
  onView: (r: ISubscriptionRenew) => void;
  onApprove: (r: ISubscriptionRenew) => void;
  onReject: (r: ISubscriptionRenew) => void;
}

const TH = ({
  children,
  cls = "",
}: {
  children: React.ReactNode;
  cls?: string;
}) => (
  <th
    className={`px-4 py-3 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap ${cls}`}
  >
    {children}
  </th>
);

export function SubscriptionRenewTable({
  requests,
  onView,
  onApprove,
  onReject,
}: Props) {
  return (
    <div className="hidden lg:block rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-50 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
              <TH>Customer</TH>
              <TH>Email</TH>
              <TH>Store</TH>
              <TH>Current Plan</TH>
              <TH>Payment Method</TH>
              <TH>Transaction ID</TH>
              <TH>Screenshot</TH>
              <TH>Requested</TH>
              <TH>Status</TH>
              <TH cls="text-right">Actions</TH>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {requests.map((req) => {
              const pm = PAYMENT_METHOD_STYLES[req.paymentMethod];
              const user = req.user as any;
              const currentPlan = user?.subscriptionPlan?.name ?? "—";
              const storeName = user?.storeName ?? user?.shopName ?? "—";

              return (
                <tr
                  key={req._id}
                  className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group"
                >
                  {/* Customer */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-400 shrink-0 overflow-hidden">
                        {user?.picture ? (
                          <Image
                            src={user.picture}
                            alt={user?.name ?? ""}
                            width={36}
                            height={36}
                            className="object-cover h-full w-full"
                          />
                        ) : (
                          getInitials(user?.name)
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white truncate max-w-35">
                          {user?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {user?.phone ?? "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate block max-w-40">
                      {req.email || user?.email || "—"}
                    </span>
                  </td>

                  {/* Store */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {storeName}
                    </span>
                  </td>

                  {/* Current Plan */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {currentPlan}
                    </span>
                  </td>

                  {/* Payment Method */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${pm.bg} ${pm.text}`}
                    >
                      {pm.label}
                    </span>
                  </td>

                  {/* Transaction ID */}
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">
                      {req.transactionId}
                    </span>
                  </td>

                  {/* Screenshot */}
                  <td className="px-4 py-3">
                    {req.paymentScreenshot ? (
                      <button
                        onClick={() => onView(req)}
                        className="relative h-10 w-10 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-amber-400 transition-all"
                      >
                        <Image
                          src={req.paymentScreenshot}
                          alt="screenshot"
                          fill
                          className="object-cover"
                        />
                      </button>
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <ImageOff className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                  </td>

                  {/* Requested Date */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDate(req.createdAt)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <RenewStatusBadge status={req.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <ActionBtn
                        icon={Eye}
                        label="View"
                        cls="text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        onClick={() => onView(req)}
                      />
                      {req.status === "PENDING" && (
                        <>
                          <ActionBtn
                            icon={Check}
                            label="Approve"
                            cls="text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                            onClick={() => onApprove(req)}
                          />
                          <ActionBtn
                            icon={X}
                            label="Reject"
                            cls="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                            onClick={() => onReject(req)}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
  cls,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  cls: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`h-7 w-7 flex items-center justify-center rounded-lg transition-all hover:scale-110 active:scale-95 ${cls}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
