import { Inbox, RotateCcw } from "lucide-react";

interface Props {
  hasFilters: boolean;
  onReset: () => void;
}

export function SubscriptionRenewEmptyState({ hasFilters, onReset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full" />
        <div className="relative h-16 w-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Inbox className="h-8 w-8 text-amber-500" />
        </div>
      </div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5">
        No renewal requests found
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        {hasFilters
          ? "No requests match your current filters. Try adjusting your search criteria."
          : "When customers submit renewal requests, they'll show up here for review."}
      </p>
      {hasFilters && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-amber-300 transition-all"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Filters
        </button>
      )}
    </div>
  );
}