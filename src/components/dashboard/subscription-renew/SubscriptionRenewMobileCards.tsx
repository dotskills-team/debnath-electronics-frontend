/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Eye, Check, X, Receipt } from "lucide-react";
import { ISubscriptionRenew } from "@/types/subscriptionRenew";
import { PAYMENT_METHOD_STYLES, formatDate, getInitials } from "@/utils/renewHelpers";
import { RenewStatusBadge } from "./RenewStatusBadge";

interface Props {
  requests: ISubscriptionRenew[];
  onView: (r: ISubscriptionRenew) => void;
  onApprove: (r: ISubscriptionRenew) => void;
  onReject: (r: ISubscriptionRenew) => void;
}

export function SubscriptionRenewMobileCards({ requests, onView, onApprove, onReject }: Props) {
  return (
    <div className="lg:hidden space-y-3">
      {requests.map((req) => {
        const pm = PAYMENT_METHOD_STYLES[req.paymentMethod];
        const user = req.user as any;

        return (
          <div
            key={req._id}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4">
              <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-400 shrink-0 overflow-hidden">
                {user?.picture ? (
                  <Image src={user.picture} alt={user?.name ?? ""} width={40} height={40} className="object-cover h-full w-full" />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {user?.name ?? "Unknown"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {req.email || user?.email}
                </p>
              </div>
              <RenewStatusBadge status={req.status} />
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-3 px-4 pb-3 text-xs">
              <div>
                <p className="text-gray-400 dark:text-gray-500 mb-0.5">Payment Method</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-medium ${pm.bg} ${pm.text}`}>
                  {pm.label}
                </span>
              </div>
              <div>
                <p className="text-gray-400 dark:text-gray-500 mb-0.5">Requested</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">{formatDate(req.createdAt)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 dark:text-gray-500 mb-0.5">Transaction ID</p>
                <p className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md inline-block">
                  {req.transactionId}
                </p>
              </div>
            </div>

            {/* Screenshot preview */}
            {req.paymentScreenshot && (
              <button
                onClick={() => onView(req)}
                className="flex items-center gap-2 mx-4 mb-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-[calc(100%-2rem)]"
              >
                <Receipt className="h-3.5 w-3.5" />
                View payment screenshot
              </button>
            )}

            {/* Actions */}
            <div className="flex border-t border-gray-100 dark:border-gray-800 divide-x divide-gray-100 dark:divide-gray-800">
              <button
                onClick={() => onView(req)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
              >
                <Eye className="h-3.5 w-3.5" />
                View
              </button>
              {req.status === "PENDING" && (
                <>
                  <button
                    onClick={() => onApprove(req)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(req)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}