import { PlansContent } from "@/components/dashboard/plans/Plans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription Plans",
  description:
    "Create, update, enable, disable, and manage subscription plans for all SaaS customers.",
};

export default function PlansManagementPage() {
  return <PlansContent />;
}