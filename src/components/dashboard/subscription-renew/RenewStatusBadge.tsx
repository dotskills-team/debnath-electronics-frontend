import { RenewStatus } from "@/types/subscriptionRenew";
import { STATUS_STYLES } from "@/utils/renewHelpers";

export function RenewStatusBadge({ status }: { status: RenewStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text} border ${s.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}