/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Search, X, RotateCcw, ArrowUpDown } from "lucide-react";
import { RenewFilterState } from "@/hooks/useRenewFilters";
import { useGetAllPlansQuery } from "@/redux/features/plan/plan.api";

interface Props {
  filters: RenewFilterState;
  hasActiveFilters: boolean;
  onSearch: (v: string) => void;
  onStatus: (v: string) => void;
  onPaymentMethod: (v: string) => void;
  onPlan: (v: string) => void;
  onDateRange: (from: string, to: string) => void;
  onSort: (v: string) => void;
  onReset: () => void;
}

const selectCls =
  "h-10 pl-3 pr-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all appearance-none cursor-pointer";

const dateCls =
  "h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all";

export function SubscriptionRenewFilters({
  filters,
  hasActiveFilters,
  onSearch,
  onStatus,
  onPaymentMethod,
  onPlan,
  onDateRange,
  onSort,
  onReset,
}: Props) {
  const [searchInput, setSearchInput] = useState(filters.searchTerm);
  const { data: plansData } = useGetAllPlansQuery({ limit: 100 } as any);
  const plans = (plansData as any)?.data ?? [];

  useEffect(() => {
    const t = setTimeout(() => onSearch(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput, onSearch]);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-55">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by transaction ID, email, note…"
            className="
              w-full h-10 pl-9 pr-9 rounded-xl border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200
              placeholder:text-gray-400 focus:outline-none focus:ring-2
              focus:ring-amber-500/40 focus:border-amber-500 transition-all
            "
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => onStatus(e.target.value)}
          className={selectCls}
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        {/* Payment Method */}
        <select
          value={filters.paymentMethod}
          onChange={(e) => onPaymentMethod(e.target.value)}
          className={selectCls}
        >
          <option value="">All Methods</option>
          <option value="BKASH">bKash</option>
          <option value="NAGAD">Nagad</option>
          <option value="ROCKET">Rocket</option>
          <option value="BANK">Bank Transfer</option>
        </select>

        {/* Plan */}
        <select
          value={filters.plan}
          onChange={(e) => onPlan(e.target.value)}
          className={selectCls}
        >
          <option value="">All Plans</option>
          {plans.map((p: any) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => onSort(e.target.value)}
            className={`${selectCls} pl-8`}
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
          </select>
          <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => { onReset(); setSearchInput(""); }}
            className="flex items-center gap-1.5 h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 hover:border-red-300 transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Date range row */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Date Range:
        </span>
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => onDateRange(e.target.value, filters.toDate)}
          className={dateCls}
        />
        <span className="text-gray-400 text-sm">to</span>
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => onDateRange(filters.fromDate, e.target.value)}
          className={dateCls}
        />
      </div>
    </div>
  );
}