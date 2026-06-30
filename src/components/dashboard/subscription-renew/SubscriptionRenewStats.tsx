"use client";

import { memo } from "react";
import { Layers, Clock, CheckCircle2, XCircle, CalendarDays } from "lucide-react";
import { IRenewStats } from "@/types/subscriptionRenew";

interface Props {
  stats?: IRenewStats;
  isLoading?: boolean;
}

const CARD_CONFIG = [
  {
    key: "totalRequests" as const,
    label: "Total Requests",
    icon: Layers,
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "pendingRequests" as const,
    label: "Pending",
    icon: Clock,
    gradient: "from-amber-400 to-orange-500",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    key: "approvedRequests" as const,
    label: "Approved",
    icon: CheckCircle2,
    gradient: "from-emerald-400 to-green-600",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "rejectedRequests" as const,
    label: "Rejected",
    icon: XCircle,
    gradient: "from-red-400 to-rose-600",
    iconBg: "bg-red-100 dark:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    key: "todayRequests" as const,
    label: "Today's Requests",
    icon: CalendarDays,
    gradient: "from-purple-400 to-fuchsia-600",
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

export const SubscriptionRenewStats = memo(function SubscriptionRenewStats({
  stats,
  isLoading,
}: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {CARD_CONFIG.map((cfg) => {
        const value = stats?.[cfg.key] ?? 0;
        return (
          <div
            key={cfg.key}
            className="
              group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800
              bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-sm
              hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300
            "
          >
            {/* Gradient accent glow on hover */}
            <div
              className={`absolute -top-8 -right-8 h-24 w-24 rounded-full bg-linear-to-br ${cfg.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}
            />

            <div className="relative flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {cfg.label}
              </span>
              <div
                className={`${cfg.iconBg} p-2 rounded-xl group-hover:scale-110 transition-transform duration-300`}
              >
                <cfg.icon className={`h-4 w-4 ${cfg.iconColor}`} />
              </div>
            </div>

            {isLoading ? (
              <div className="h-8 w-14 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : (
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
                {value.toLocaleString()}
              </p>
            )}

            {/* Bottom gradient bar */}
            <div
              className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-linear-to-r ${cfg.gradient} transition-all duration-500`}
            />
          </div>
        );
      })}
    </div>
  );
});