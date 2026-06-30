export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-sm animate-pulse"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
          <div className="h-8 w-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm animate-pulse">
      <div className="flex flex-wrap gap-3">
        <div className="h-10 flex-1 min-w-50 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="hidden lg:block rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
            {Array.from({ length: 10 }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b border-gray-100 dark:border-gray-800">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                  <div className="h-3.5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </td>
              {Array.from({ length: 8 }).map((_, c) => (
                <td key={c} className="px-4 py-3">
                  <div className="h-3.5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  <div className="h-7 w-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MobileCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="lg:hidden space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm animate-pulse space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}