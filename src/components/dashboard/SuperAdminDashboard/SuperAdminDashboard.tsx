/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { format } from "date-fns";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  ArrowRight,
  Activity,
  User,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useGetSubscriptionStatsQuery,
  useGetAllUsersQuery,
  useGetExpiringSoonSubscriptionsQuery,
} from "@/redux/features/user/user.api";
import {
  useGetPlanStatsQuery,
  useGetAllPlansQuery,
} from "@/redux/features/plan/plan.api";
import {
  StatCard,
  CardSkeleton,
  RoleBadge,
  SubscriptionBadge,
} from "@/components/dashboard/shared/UiPrimitives";
import { IUser, IPlan } from "@/types/plan";

function StatsSection() {
  const { data: subStats, isLoading: subLoading } =
    useGetSubscriptionStatsQuery();
  const { data: planStats, isLoading: planLoading } = useGetPlanStatsQuery();

  const s = subStats?.data;
  const p = planStats?.data;

  const cards = [
    {
      label: "Total Users",
      value: s?.totalUsers ?? 0,
      icon: Users,
      accent:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
      sub: "Registered admins & staff",
    },
    {
      label: "Active Subscriptions",
      value: s?.activeSubscriptions ?? 0,
      icon: CheckCircle2,
      accent:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
      trend: s
        ? {
            value:
              s.totalUsers > 0
                ? `${Math.round((s.activeSubscriptions / s.totalUsers) * 100)}% of users`
                : "—",
            up: true,
          }
        : undefined,
    },
    {
      label: "Expired",
      value: s?.expiredSubscriptions ?? 0,
      icon: XCircle,
      accent:
        (s?.expiredSubscriptions ?? 0) > 0
          ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
          : "bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500",
    },
    {
      label: "Expiring Soon",
      value: s?.expiringSoonSubscriptions ?? 0,
      icon: Clock,
      accent:
        (s?.expiringSoonSubscriptions ?? 0) > 0
          ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
          : "bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500",
      sub: "Within 7 days",
    },
    {
      label: "Total Plans",
      value: p?.totalPlans ?? 0,
      icon: Package,
      accent:
        "bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
      sub: `${p?.activePlans ?? 0} active`,
    },
    {
      label: "Active Plans",
      value: p?.activePlans ?? 0,
      icon: Activity,
      accent: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
  ];

  if (subLoading || planLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}

function RecentUsers() {
  const { data, isLoading } = useGetAllUsersQuery({
    limit: 5,
    sort: "-createdAt",
  });

const rawData = data?.data;
const users: IUser[] = Array.isArray(rawData)
  ? rawData
  : Array.isArray((rawData as any)?.items)
    ? (rawData as any).items
    : [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-xl bg-amber-50/60 dark:bg-amber-900/10"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No users yet</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-800/30 hover:bg-amber-50/30 dark:hover:bg-amber-900/10 transition-colors"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-900/20">
              <User className="h-4 w-4 text-amber-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                {user.name}
              </p>
              <p className="truncate text-xs text-gray-400 dark:text-gray-500">
                {user.email}
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1">
              <RoleBadge role={user.role} />
              {user.createdAt && (
                <span className="text-[10px] text-gray-400 tabular-nums">
                  {format(new Date(user.createdAt), "MMM d")}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ExpiringSoon() {
  const { data, isLoading } = useGetExpiringSoonSubscriptionsQuery();
  const rawData = data?.data;
const users: IUser[] = Array.isArray(rawData)
  ? rawData
  : Array.isArray((rawData as any)?.items)
    ? (rawData as any).items
    : [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-xl bg-orange-50/60 dark:bg-orange-900/10"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          No expiring subscriptions
        </p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-3 rounded-xl border border-orange-100/80 bg-orange-50/30 px-3 py-2.5 dark:border-orange-900/20 dark:bg-orange-900/5 hover:bg-orange-50/60 dark:hover:bg-orange-900/10 transition-colors"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/20">
              <Clock className="h-4 w-4 text-orange-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                {user.name}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                Expires{" "}
                {user.subscriptionExpireAt
                  ? format(new Date(user.subscriptionExpireAt), "MMM d, yyyy")
                  : "—"}
              </p>
            </div>
            <SubscriptionBadge
              access={user.subscriptionAccess}
              expireAt={user.subscriptionExpireAt}
            />
          </div>
        ))
      )}
    </div>
  );
}

function PlansOverview() {
  const { data, isLoading } = useGetAllPlansQuery({});
  const plans: IPlan[] = (data?.data as any) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-xl bg-violet-50/60 dark:bg-violet-900/10"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {plans.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">
          No plans created yet
        </p>
      ) : (
        plans.map((plan) => (
          <div
            key={plan._id}
            className="flex items-center gap-3 rounded-xl border border-violet-100/80 bg-violet-50/20 px-3 py-2.5 dark:border-violet-900/20 dark:bg-violet-900/5 hover:bg-violet-50/40 dark:hover:bg-violet-900/10 transition-colors"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-50 dark:bg-violet-900/20">
              <Package className="h-4 w-4 text-violet-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                {plan.name}
              </p>
              <p className="text-xs text-gray-400">
                ৳{plan.price} · {plan.durationInDays} days
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                plan.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {plan.status}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

function DashboardPanel({
  title,
  icon: Icon,
  accentClass,
  href,
  children,
}: {
  title: string;
  icon: React.ElementType;
  accentClass: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900 overflow-hidden">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-lg ${accentClass}`}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50">
            {title}
          </h3>
        </div>
        <Link href={href}>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-gray-500 hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsSection />

      {/* Panels grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardPanel
          title="Recent Users"
          icon={Users}
          accentClass="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
          href="/staff/dashboard/superadmin/users"
        >
          <RecentUsers />
        </DashboardPanel>

        <DashboardPanel
          title="Expiring Soon"
          icon={Clock}
          accentClass="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
          href="/staff/dashboard/superadmin/subscription-renew"
        >
          <ExpiringSoon />
        </DashboardPanel>

        <DashboardPanel
          title="Active Plans"
          icon={Package}
          accentClass="bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400"
          href="/staff/dashboard/superadmin/plans"
        >
          <PlansOverview />
        </DashboardPanel>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          {
            href: "/staff/dashboard/superadmin/users",
            label: "Manage Users",
            icon: Users,
            color: "amber",
          },
          // {
          //   href: "/staff/dashboard/superadmin/subscriptions",
          //   label: "Manage Subscriptions",
          //   icon: CreditCard,
          //   color: "emerald",
          // },
          {
            href: "/staff/dashboard/superadmin/plans",
            label: "Manage Plans",
            icon: Package,
            color: "violet",
          },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={href}>
            <div
              className={`group flex items-center gap-3 rounded-2xl border px-5 py-4 transition-all duration-200 hover:shadow-md cursor-pointer
              ${
                color === "amber"
                  ? "border-amber-200/60 hover:bg-amber-50/30 dark:border-amber-800/30 dark:hover:bg-amber-900/10"
                  : color === "emerald"
                    ? "border-emerald-200/60 hover:bg-emerald-50/30 dark:border-emerald-800/30 dark:hover:bg-emerald-900/10"
                    : "border-violet-200/60 hover:bg-violet-50/30 dark:border-violet-800/30 dark:hover:bg-violet-900/10"
              }
              border-gray-200/80 bg-white dark:border-gray-700/60 dark:bg-gray-900`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110
                ${
                  color === "amber"
                    ? "bg-amber-50 dark:bg-amber-900/20"
                    : color === "emerald"
                      ? "bg-emerald-50 dark:bg-emerald-900/20"
                      : "bg-violet-50 dark:bg-violet-900/20"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    color === "amber"
                      ? "text-amber-600 dark:text-amber-400"
                      : color === "emerald"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-violet-600 dark:text-violet-400"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                  {label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Click to open
                </p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors dark:text-gray-700 dark:group-hover:text-gray-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
