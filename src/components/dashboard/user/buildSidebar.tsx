/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type PageAccess,
  type UserRole,
  defaultRolePermissions,
  availablePages,
  superadminAvailablePages,
} from "@/lib/permissions";
import {
  LayoutDashboard,
  Package,
  Users,
  User,
  ShoppingCart,
  LogOut,
  Folder,
  Tag,
  Ticket,
  ListOrdered,
  Target,
  Store,
  Box,
  ArrowLeft,
  Settings,
  CreditCard,
} from "lucide-react";

export interface SidebarItem {
  id: PageAccess;
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  description?: string;
  children?: SidebarItem[];
}

const iconMap: Record<PageAccess, React.ReactNode> = {
  dashboard: <LayoutDashboard className="h-5 w-5" />,
  superadmin: <LayoutDashboard className="h-5 w-5" />,
  users: <Users className="h-5 w-5" />,
  plans: <CreditCard className="h-5 w-5" />,
  "my-orders": <Package className="h-5 w-5" />,
  "subscription-renew": <Settings className="h-5 w-5" />,
  "orders-management": <ListOrdered className="h-5 w-5" />,
  "user-management": <Users className="h-5 w-5" />,
  "staff-management": <Users className="h-5 w-5" />,
  "customer-management": <User className="h-5 w-5" />,
  "my-customers": <User className="h-5 w-5" />,
  "product-management": <ShoppingCart className="h-5 w-5" />,
  returns: <ArrowLeft className="h-5 w-5" />,
  "purchase-products": <Box className="h-5 w-5" />,
  "category-management": <Folder className="h-5 w-5" />,
  "brand-management": <Tag className="h-5 w-5" />,

  coupons: <Ticket className="h-5 w-5" />,
  pos: <Store className="h-5 w-5" />,
  "courier-settings": <Settings className="h-5 w-5" />,
};

const pageHrefMap: Record<any, string> = {
  dashboard: "/staff/dashboard",
  superadmin: "/staff/dashboard/superadmin",
  users: "/staff/dashboard/superadmin/users",
  plans: "/staff/dashboard/superadmin/plans",
  "product-management": "/staff/dashboard/product-management",
  "subscription-renew": "/staff/dashboard/superadmin/subscription-renew",
  "category-management": "/staff/dashboard/category-management",
  "brand-management": "/staff/dashboard/admin/brand-management",
  "purchase-products": "/staff/dashboard/admin/purchase-products",
  returns: "/staff/dashboard/admin/returns",
  coupons: "/staff/dashboard/coupons",
  "staff-management": "/staff/dashboard/admin/user-management",
  "customer-management": "/staff/dashboard/admin/customer-management",
  "my-customers": "/staff/dashboard/my-customers",
  "orders-management": "/staff/dashboard/orders-management",
  "my-orders": "/staff/dashboard/my-orders",
  pos: "/staff/dashboard/pos",
  "courier-settings": "/staff/dashboard/admin/courier-settings",
};

export const buildSidebarItems = (
  userRole: UserRole,
  customPermissions?: PageAccess[],
): SidebarItem[] => {
  const permittedPages =
    userRole === "SUPER_ADMIN"
      ? superadminAvailablePages.map((p) => p.id)
      : userRole === "ADMIN"
        ? availablePages.map((p) => p.id)
        : customPermissions?.length
          ? customPermissions
          : defaultRolePermissions[userRole];

  const sections: Record<string, PageAccess[]> = {
    core: ["dashboard"],
    superadmin: [
    "superadmin",
    "users",
    "subscription-renew",
    "plans",
  ],
    management: [
      "product-management",
      "purchase-products",
      "returns",
      "category-management",
      "brand-management",
      "coupons",
      "staff-management",
      "customer-management",
      "my-customers",
    ],
    operations: [
      "orders-management",
      "my-orders",
      "pos",
      "courier-settings",
    ],
  };

  // Build sidebar items organized by sections, then add profile and logout
  const sidebarItems: SidebarItem[] = [];

  // Add items in priority order (maintaining section organization)
  Object.entries(sections).forEach(([_section, pageIds]) => {
    pageIds.forEach((pageId) => {
      if (permittedPages.includes(pageId)) {
        const allPages =
          userRole === "SUPER_ADMIN"
            ? superadminAvailablePages
            : availablePages;

        const page = allPages.find((p) => p.id === pageId);

        if (page) {
          sidebarItems.push({
            id: page.id,
            title: page.label,
            href: pageHrefMap[page.id],
            icon: iconMap[page.id],
            description: `Access ${page.label.toLowerCase()}`,
          });
        }
      }
    });
  });

  return sidebarItems;
};

export const getSidebarItemsByRole = (userRole: UserRole): SidebarItem[] => {
  return buildSidebarItems(userRole);
};

export const getSidebarItemsWithCustomPermissions = (
  userRole: UserRole,
  customPermissions: PageAccess[],
): SidebarItem[] => {
  return buildSidebarItems(userRole, customPermissions);
};
