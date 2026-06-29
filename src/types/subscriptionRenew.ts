import { IUser } from ".";

export type RenewStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type PaymentMethod =
  | "BKASH"
  | "NAGAD"
  | "ROCKET"
  | "BANK";

export interface ISubscriptionRenew {
  _id: string;

  user: IUser;

  paymentMethod: PaymentMethod;

  transactionId: string;

  paymentScreenshot: string;

  note?: string;

  status: RenewStatus;

  approvedBy?: IUser;

  approvedAt?: string;

  rejectionReason?: string;

  createdAt: string;

  updatedAt: string;
}

export interface ICreateRenewPayload {
  paymentMethod: PaymentMethod;
  transactionId: string;
  paymentScreenshot: string;
  note?: string;
}

export interface IApproveRenewPayload {
  planId: string;
  customPrice?: number;
  durationInDays?: number;
}

export interface IRejectRenewPayload {
  rejectionReason: string;
}

export interface IRenewStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  todayRequests: number;
  thisMonthRequests: number;
}

export interface IRenewListResponse {
  success: boolean;
  data: ISubscriptionRenew[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}