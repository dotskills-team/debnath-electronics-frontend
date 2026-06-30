"use client";

import { useCallback, useState, useTransition } from "react";
import { GetQueryParams } from "@/types";

export interface RenewFilterState extends GetQueryParams {
  page: number;
  limit: number;
  searchTerm: string;
  status: string;
  paymentMethod: string;
  plan: string;
  fromDate: string;
  toDate: string;
  sort: string;
}

const DEFAULTS: RenewFilterState = {
  page: 1,
  limit: 10,
  searchTerm: "",
  status: "",
  paymentMethod: "",
  plan: "",
  fromDate: "",
  toDate: "",
  sort: "-createdAt",
};

export function useRenewFilters() {
  const [filters, setFilters] = useState<RenewFilterState>(DEFAULTS);
  const [, startTransition] = useTransition();

  const setSearch = useCallback((searchTerm: string) => {
    startTransition(() => setFilters((p) => ({ ...p, searchTerm, page: 1 })));
  }, []);

  const setStatus = useCallback((status: string) => {
    setFilters((p) => ({ ...p, status, page: 1 }));
  }, []);

  const setPaymentMethod = useCallback((paymentMethod: string) => {
    setFilters((p) => ({ ...p, paymentMethod, page: 1 }));
  }, []);

  const setPlan = useCallback((plan: string) => {
    setFilters((p) => ({ ...p, plan, page: 1 }));
  }, []);

  const setDateRange = useCallback((fromDate: string, toDate: string) => {
    setFilters((p) => ({ ...p, fromDate, toDate, page: 1 }));
  }, []);

  const setSort = useCallback((sort: string) => {
    setFilters((p) => ({ ...p, sort, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((p) => ({ ...p, page }));
  }, []);

  const reset = useCallback(() => setFilters(DEFAULTS), []);

  const queryParams = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== "" && v !== undefined)
  ) as GetQueryParams;

  const hasActiveFilters =
    !!filters.status ||
    !!filters.paymentMethod ||
    !!filters.plan ||
    !!filters.fromDate ||
    !!filters.toDate ||
    !!filters.searchTerm;

  return {
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
  };
}