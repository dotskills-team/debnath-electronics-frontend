import type { Metadata } from "next";
import { UsersManagementAccess } from "@/components/dashboard/users/UsersManagementAccess";

export const metadata: Metadata = {
  title: "Users Management",
  description:
    "Create, update, manage subscriptions, and control user access across the SaaS platform.",
};

export default function UsersManagementPage() {
  return <UsersManagementAccess />;
}