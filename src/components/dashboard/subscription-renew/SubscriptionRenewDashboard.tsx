/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { RefreshCw } from "lucide-react";

import { ISubscriptionRenew } from "@/types/subscriptionRenew";
import { useRenewFilters } from "@/hooks/useRenewFilters";
import {
  useGetAllRenewRequestsQuery,
  useGetRenewStatsQuery,
} from "@/redux/features/subscriptionRenew/subscriptionRenew.api";

import { SubscriptionRenewStats } from "./SubscriptionRenewStats";
import { SubscriptionRenewFilters } from "./SubscriptionRenewFilters";
import { SubscriptionRenewTable } from "./SubscriptionRenewTable";
import { SubscriptionRenewMobileCards } from "./SubscriptionRenewMobileCards";
import { SubscriptionRenewPagination } from "./SubscriptionRenewPagination";
import { SubscriptionRenewDetailsModal } from "./SubscriptionRenewDetailsModal";
import { SubscriptionRenewApproveDialog } from "./SubscriptionRenewApproveDialog";
import { SubscriptionRenewRejectDialog } from "./SubscriptionRenewRejectDialog";
import { SubscriptionRenewEmptyState } from "./SubscriptionRenewEmptyState";
import {
  StatsSkeleton,
  FiltersSkeleton,
  TableSkeleton,
  MobileCardsSkeleton,
} from "./SubscriptionRenewSkeleton";

export function SubscriptionRenewDashboard() {
  const {
    filters,
    queryParams,
    hasActiveFilters,
    setSearch,
    setStatus,
    setPaymentMethod,
    setPlan,
    setDateRange,
    setSort,
    setPage,
    reset,
  } = useRenewFilters();

  const [viewRequest, setViewRequest] = useState<ISubscriptionRenew | null>(
    null,
  );
  const [approveRequest, setApproveRequest] =
    useState<ISubscriptionRenew | null>(null);
  const [rejectRequest, setRejectRequest] = useState<ISubscriptionRenew | null>(
    null,
  );

  const { data, isLoading, isFetching, refetch } =
    useGetAllRenewRequestsQuery(queryParams);
  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetRenewStatsQuery();

  const requests = data?.data ?? [];
  const meta = data?.meta;
  const stats = statsData as any;

  const handleRefresh = useCallback(() => {
    refetch();
    refetchStats();
  }, [refetch, refetchStats]);

  const handleActionSuccess = useCallback(() => {
    refetch();
    refetchStats();
  }, [refetch, refetchStats]);

  const showSkeleton = isLoading;
  const showRefreshing = !isLoading && isFetching;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-350 mx-auto space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Subscription Renewal Requests
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage all customer renewal requests and subscription approvals.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="
              inline-flex items-center gap-2 h-10 px-4 rounded-xl
              border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900
              text-sm font-medium text-gray-700 dark:text-gray-300
              hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-amber-300
              transition-all duration-150 active:scale-[0.97]
              disabled:opacity-60 self-start sm:self-auto
            "
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        {statsLoading ? (
          <StatsSkeleton />
        ) : (
          <SubscriptionRenewStats stats={stats?.data} isLoading={statsLoading} />
        )}

        {/* ── Filters ── */}
        {showSkeleton ? (
          <FiltersSkeleton />
        ) : (
          <SubscriptionRenewFilters
            filters={filters}
            hasActiveFilters={hasActiveFilters}
            onSearch={setSearch}
            onStatus={setStatus}
            onPaymentMethod={setPaymentMethod}
            onPlan={setPlan}
            onDateRange={setDateRange}
            onSort={setSort}
            onReset={reset}
          />
        )}

        {/* ── Refetch indicator ── */}
        {showRefreshing && (
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 animate-pulse -mt-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Refreshing…
          </div>
        )}

        {/* ── Content ── */}
        {showSkeleton ? (
          <>
            <TableSkeleton />
            <MobileCardsSkeleton />
          </>
        ) : requests.length === 0 ? (
          <SubscriptionRenewEmptyState
            hasFilters={hasActiveFilters}
            onReset={reset}
          />
        ) : (
          <>
            <SubscriptionRenewTable
              requests={requests}
              onView={setViewRequest}
              onApprove={setApproveRequest}
              onReject={setRejectRequest}
            />
            <SubscriptionRenewMobileCards
              requests={requests}
              onView={setViewRequest}
              onApprove={setApproveRequest}
              onReject={setRejectRequest}
            />
          </>
        )}

        {/* ── Pagination ── */}
        {meta && (
          <SubscriptionRenewPagination
            page={meta.page}
            totalPage={meta.totalPage}
            total={meta.total}
            limit={meta.limit}
            onPage={setPage}
          />
        )}
      </div>

      {/* ── Modals ── */}
      <SubscriptionRenewDetailsModal
        request={viewRequest}
        isOpen={!!viewRequest}
        onClose={() => setViewRequest(null)}
        onApprove={(r) => {
          setViewRequest(null);
          setApproveRequest(r);
        }}
        onReject={(r) => {
          setViewRequest(null);
          setRejectRequest(r);
        }}
      />

      <SubscriptionRenewApproveDialog
        request={approveRequest}
        isOpen={!!approveRequest}
        onClose={() => setApproveRequest(null)}
        onSuccess={handleActionSuccess}
      />

      <SubscriptionRenewRejectDialog
        request={rejectRequest}
        isOpen={!!rejectRequest}
        onClose={() => setRejectRequest(null)}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
}
