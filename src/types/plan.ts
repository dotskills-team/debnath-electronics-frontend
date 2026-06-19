export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  MODERATOR = "MODERATOR",
  TELLICELSS = "TELLICELSS",
  CUSTOMER = "CUSTOMER",
  GENERALSTAFF = "GENERALSTAFF",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export enum PlanStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IPlan {
  _id: string;
  name: string;
  slug: string;
  price: number;
  durationInDays: number;
  description?: string;
  maxUsers?: number;
  features?: string[];
  status: PlanStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address: string;
  picture?: string;
  role: Role;
  isActive: IsActive;
  isDeleted?: boolean;
  isVerified?: boolean;
  subscriptionPlan?: IPlan | string;
  subscriptionPrice?: number;
  subscriptionAccess?: boolean;
  subscriptionStartAt?: string;
  subscriptionExpireAt?: string;
  lastLoginAt?: string;
  salary?: number;
  commissionSalary?: number;
  createdAt?: string;
  updatedAt?: string;
}