export type PageAccess =
  | "dashboard"
  | "superadmin"
  | "users"
  | "plans"
  | "my-orders"
  | "user-management"
  | "subscription-renew"
  | "purchase-products"
  | "staff-management"
  | "product-management"
  | "returns"
  | "category-management"
  | "brand-management"
  | "coupons"
  | "customer-management"
  | "my-customers"
  | "orders-management"
  | "pos"
  | "courier-settings";

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "MODERATOR"
  | "CUSTOMER"
  | "TELLICELSS";

export interface UserPermissions {
  role: UserRole;
  pageAccess: PageAccess[];
  createdAt: Date;
  updatedAt: Date;
}

// Default page access for each role
export const defaultRolePermissions: Record<UserRole, PageAccess[]> = {
  SUPER_ADMIN: ["superadmin", "users", "subscription-renew", "plans"],
  ADMIN: [
    "dashboard",
    "product-management",
    "purchase-products",
    "returns",
    "category-management",
    "brand-management",
    "coupons",
    "staff-management",
    "customer-management",
    "my-customers",
    "orders-management",
    "my-orders",
    "pos",
    "courier-settings",
  ],
  MANAGER: [
    "dashboard",
    "product-management",
    "category-management",
    "coupons",
    "orders-management",
    "my-orders",
    "pos",
  ],
  TELLICELSS: [
    "dashboard",
    "product-management",
    "category-management",
    "coupons",
    "orders-management",
    "my-orders",
    "pos",
  ],
  MODERATOR: ["dashboard", "product-management", "my-orders"],
  CUSTOMER: ["dashboard", "my-orders"],
};

// All available pages that can be assigned
export const availablePages: { id: PageAccess; label: string; icon: string }[] =
  [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "product-management", label: "Products", icon: "🛍️" },
    { id: "category-management", label: "Categories", icon: "📁" },
    { id: "brand-management", label: "Brands", icon: "🏷️" },
    // { id: "subscription-renew", label: "Subscription Renew", icon: "📋" },
    { id: "coupons", label: "Coupons", icon: "🎁" },
    { id: "purchase-products", label: "Purchase Products", icon: "🛒" },
    { id: "returns", label: "Returns", icon: "📦" },
    { id: "staff-management", label: "Staffs", icon: "👥" },
    { id: "customer-management", label: "Customers", icon: "👤" },
    { id: "my-customers", label: "My Customers", icon: "💼" },
    { id: "orders-management", label: "Orders", icon: "📦" },
    { id: "my-orders", label: "My Orders", icon: "📋" },
    { id: "pos", label: "POS", icon: "🛒" },

    { id: "user-management", label: "User Management", icon: "🔐" },
    { id: "courier-settings", label: "Courier Settings", icon: "🧰" },
  ];

export const superadminAvailablePages: {
  id: PageAccess;
  label: string;
  icon: string;
}[] = [
  { id: "superadmin", label: "Overview", icon: "📊" },
  { id: "users", label: "Users", icon: "👤" },
  { id: "subscription-renew", label: "Renew", icon: "👤" },
  { id: "plans", label: "Plans", icon: "🛍️" },
];

export const hasPageAccess = (
  userPermissions: PageAccess[],
  page: PageAccess,
): boolean => {
  return userPermissions.includes(page);
};

export const canAccessPage = (
  userRole: UserRole,
  page: PageAccess,
  customPermissions?: PageAccess[],
): boolean => {
  const permissions = customPermissions || defaultRolePermissions[userRole];
  return permissions.includes(page);
};
