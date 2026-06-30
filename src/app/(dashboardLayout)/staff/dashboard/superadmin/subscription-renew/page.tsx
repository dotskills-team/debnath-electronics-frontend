import type { Metadata } from "next";
import { SubscriptionRenewDashboard } from "@/components/dashboard/subscription-renew/SubscriptionRenewDashboard";

export const metadata: Metadata = {
  title: "Subscription Renewals | Super Admin",
  description: "Review, approve, and manage customer subscription renewal requests.",
};

export default function SubscriptionRenewPage() {
  return <SubscriptionRenewDashboard />;
}