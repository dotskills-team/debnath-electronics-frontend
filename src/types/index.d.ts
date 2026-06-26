export * from "./pos";
export type { Order, OrderStatus, DeliveryStatus } from "../types/orders";
export type { CourierProvider } from "../types/courier";
export type { GetQueryParams } from "../types/orders";

export interface IIngredient {
  name: string;
  price: number;
}

// export interface IUser {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   address: string;
//   subscriptionPlan?: {
//     _id: string;
//     name: string;
//     price: number;
//     durationInDays: number;
//   };
//   picture?: string;
//   role: Role;
//   isActive: IsActive;
//   isDeleted?: boolean;
//   isVerified?: boolean;
//   subscriptionPlan?: IPlan | string;
//   subscriptionPrice?: number;
//   subscriptionAccess?: boolean;
//   subscriptionStartAt?: string;
//   subscriptionExpireAt?: string;
//   lastLoginAt?: string;
//   salary?: number;
//   commissionSalary?: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

export interface SubscriptionStats {
  totalUsers: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  expiringSoonSubscriptions: number;
}

export interface PlanStats {
  totalPlans: number;
  activePlans: number;
  inactivePlans: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  meta: PaginationMeta;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address: string;
  role: Role;
  planId?: string;
  durationInDays?: number;
}

export interface UpdateSubscriptionPayload {
  id: string;
  planId: string;
  customPrice?: number;
  durationInDays?: number;
}

export interface ToggleSubscriptionPayload {
  id: string;
  subscriptionAccess: boolean;
  subscriptionExpireAt?: string;
}

export interface CreatePlanPayload {
  name: string;
  slug: string;
  price: number;
  durationInDays: number;
  description?: string;
  maxUsers?: number;
  features?: string[];
  status?: PlanStatus;
}

export interface UpdatePlanPayload {
  id: string;
  data: Partial<CreatePlanPayload>;
}

export type GetQueryParams = {
  searchTerm?: string;
  sort?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
};

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  paymentMethod?: string;
  status?: string;
}

export type { ILogin, IRegister } from "./auth.type";

export interface IResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ISidebarItem {
  title: string;
  items: {
    title: string;
    url: string;
    component: ComponentType;
  }[];
}

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  MODERATOR = "MODERATOR",
  TELLICELSS = "TELLICELSS",
}
export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IPermission {
  _id: string;
  title: string;
  url: string;
  group: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  permissions?: IPermission[];
  address: string;
  status?: string;
  subscriptionPlan?: {
    _id: string;
    name: string;
    price: number;
    durationInDays: number;
  };
  picture?: string;
  isActive?: IsActive;
  isVerified?: boolean;
  isDeleted?: boolean;
  salary?: number;
  commissionSalary?: number;
  role?: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserApiResponse {
  data: IUser;
}

export enum CategoryStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface ICategory {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  status: CategoryStatus;
  productCount: number;
}

export enum BrandStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IBrand {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  status: BrandStatus;
}

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

// ------ product ---
export interface IProduct {
  quantity: ReactNode;
  _id?: string;
  barcode?: string;

  // Basic Info
  title: string;
  totalRevenue: number;
  isCusFavorite: boolean;
  isFeatured: boolean;
  warrantyEnabled?: boolean;

  warrantyType?: "WARRANTY" | "GUARANTEE";

  warrantyDay?: string;
  brand: {
    _id: string;
    title: string;
    slug: string;
  };
  category: {
    _id: string;
    title: string;
    slug: string;
    image: string[];
  };
  size?: string;
  slug?: string;

  // Pricing
  price: number;
  discountPrice?: number;
  buyingPrice?: number;

  // Stock / Availability
  totalAddedStock?: number;
  totalSold?: number;
  availableStock?: number;
  status: ProductStatus;
  isDeleted?: boolean;
  // Media
  images: string[];

  // Ratings & Reviews
  ratings?: number;
  reviews?: {
    user: string;
    rating: number;
    comment: string;
    date: Date;
  }[];

  // Description
  description: string;

  // Optional meta
  createdAt?: Date;
  updatedAt?: Date;
}
