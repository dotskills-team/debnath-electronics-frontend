import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard/SuperAdminDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Super Admin Dashboard",
  description:
    "Manage platform subscriptions, users, plans, and monitor SaaS operations from the Super Admin dashboard.",
};

export default function SuperAdminDashboardPage() {
  return <SuperAdminDashboard />;
}
