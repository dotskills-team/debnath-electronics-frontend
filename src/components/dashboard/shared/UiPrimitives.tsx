/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon, AlertCircle, SearchX } from "lucide-react";
import { IsActive, PlanStatus, Role } from "@/types/plan";
import { Button } from "@/components/ui/button";

const ROLE_STYLES: Record<Role, string> = {
  SUPER_ADMIN:  "bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700",
  ADMIN:        "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  MANAGER:      "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
  MODERATOR:    "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-700",
  TELLICELSS:   "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700",
  CUSTOMER:     "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  GENERALSTAFF: "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700",
};

export function RoleBadge({ role }: { role: Role }) {
  return (
    <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wide px-2", ROLE_STYLES[role])}>
      {role.replace("_", " ")}
    </Badge>
  );
}

const ACTIVE_STYLES: Record<IsActive, string> = {
  ACTIVE:   "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  INACTIVE: "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  BLOCKED:  "bg-red-50 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
};

export function ActiveStatusBadge({ status }: { status: IsActive }) {
  return (
    <Badge variant="outline" className={cn("text-[10px] font-bold px-2", ACTIVE_STYLES[status])}>
      {status}
    </Badge>
  );
}

export function SubscriptionBadge({
  access,
  expireAt,
}: {
  access?: boolean;
  expireAt?: string;
}) {
  const now = new Date();
  const isExpired = expireAt ? new Date(expireAt) < now : false;
  const isExpiringSoon =
    expireAt && !isExpired
      ? new Date(expireAt) < new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      : false;

  if (!access || isExpired) {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 text-[10px] font-bold px-2">
        Expired
      </Badge>
    );
  }
  if (isExpiringSoon) {
    return (
      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800 text-[10px] font-bold px-2">
        Expiring Soon
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 text-[10px] font-bold px-2">
      Active
    </Badge>
  );
}

export function PlanStatusBadge({ status }: { status: PlanStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-bold px-2",
        status === PlanStatus.ACTIVE
          ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
          : "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
      )}
    >
      {status}
    </Badge>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  icon: LucideIcon;
  accent: string;
  trend?: { value: string; up?: boolean };
}

export function StatCard({ label, value, sub, icon: Icon, accent, trend }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white px-5 py-4 transition-all duration-200 hover:border-amber-200 hover:shadow-md dark:border-gray-700/60 dark:bg-gray-900 dark:hover:border-amber-900/40">
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-amber-50/0 transition-all duration-300 group-hover:bg-amber-50/30 dark:group-hover:bg-amber-900/5" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums leading-tight text-gray-900 dark:text-gray-50">
            {value}
          </p>
          {sub && (
            <p className="mt-0.5 text-[11px] text-gray-400 dark:text-gray-500">{sub}</p>
          )}
          {trend && (
            <p className={cn("mt-0.5 text-[11px] font-semibold", trend.up ? "text-emerald-600" : "text-red-500")}>
              {trend.value}
            </p>
          )}
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", accent)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <Icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon: Icon = SearchX, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20">
        <Icon className="h-8 w-8 text-amber-300 dark:text-amber-700" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</p>
        {description && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{description}</p>
        )}
      </div>
      {action && (
        <Button size="sm" onClick={action.onClick} className="bg-amber-600 hover:bg-amber-700 text-white">
          {action.label}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({ message = "Something went wrong. Please try again." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
        <AlertCircle className="h-7 w-7 text-red-400" />
      </div>
      <p className="text-sm font-semibold text-red-700 dark:text-red-400">{message}</p>
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid gap-4 h-14 animate-pulse rounded-xl bg-amber-50/60 dark:bg-amber-900/10"
          style={{ animationDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-7 w-16 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-2 w-32 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
        <div className="h-11 w-11 rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
  title = "Are you sure?",
  description = "This action cannot be undone.",
}: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-gray-200/80 dark:border-gray-700/60 max-w-md">
        <div className="h-1 w-full rounded-t-2xl bg-linear-to-r from-red-500 via-orange-400 to-red-500 -mt-6 mb-4" />
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-base font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20">
              <Trash2 className="h-4 w-4 text-red-500" />
            </div>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} className="rounded-xl">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={onConfirm}
            className="rounded-xl bg-red-500 hover:bg-red-600 text-white gap-1.5"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Deleting…
              </span>
            ) : (
              <><Trash2 className="h-3.5 w-3.5" /> Delete</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}