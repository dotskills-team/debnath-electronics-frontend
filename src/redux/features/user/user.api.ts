import { IRegisterResponse } from "@/types/auth.types";
import { baseApi } from "../baseApi";
import type {
  IUser,
  IUserApiResponse,
  IResponse,
  GetQueryParams,
} from "@/types";
import { ILead } from "@/types/lead.types";

interface GetAllUsersResponse {
  success: boolean;
  data: IUser[];
  meta: {
    total: number;
    totalPage: number;

    totalStaffs: number;
    totalFixedSalary: number;
    totalSalaryByProduct: number;
    totalSalary: number;
  };
}

interface SubscriptionStats {
  totalUsers: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  expiringSoonSubscriptions: number;
}

interface Plan {
  _id: string;
  name: string;
  slug: string;
  price: number;
  durationInDays: number;
  description?: string;
  maxUsers?: number;
  features?: string[];
  status: "ACTIVE" | "INACTIVE";
}

interface SubscriptionUser {
  subscriptionAccess: boolean;
  subscriptionPrice: number;
  subscriptionStartAt: string;
  subscriptionExpireAt: string;
  subscriptionPlan?: Plan;
}

export const userApi = baseApi.injectEndpoints({
  // CREATE USER
  endpoints: (builder) => ({
    register: builder.mutation<IResponse<IRegisterResponse>, FormData>({
      query: (formData) => ({
        url: "/user/create-user",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: () => ["USERS"],
    }),

    // UPDATE USER
    updateUser: builder.mutation<
      IResponse<IUser>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "USERS",
        { type: "USER", id },
      ],
    }),

    updateUserPermissions: builder.mutation({
      query: ({ id, permissions }) => ({
        url: `/user/${id}/permissions`,
        method: "PATCH",
        data: { permissions },
      }),
    }),

    toggleSubscriptionAccess: builder.mutation<
      IResponse<IUser>,
      {
        id: string;
        subscriptionAccess: boolean;
        subscriptionExpireAt?: string;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/user/${id}/subscription-access`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "USERS",
        { type: "USER", id },
      ],
    }),

    // DELETE USER
    deleteUser: builder.mutation<IResponse<{ id: string }>, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "USERS",
        "CUSTOMERS",
        { type: "USER", id },
        { type: "CUSTOMER", id },
      ],
    }),

    // GET SINGLE USER
    getSingleUser: builder.query<IUserApiResponse, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "USER", id }],
    }),

    getAllUsers: builder.query<GetAllUsersResponse, GetQueryParams>({
      query: (params) => ({
        url: "/user/all-users",
        method: "GET",
        params: params,
      }),
      providesTags: ["USERS"],
    }),

    getAllCustomers: builder.query<GetAllUsersResponse, GetQueryParams>({
      query: (params) => ({
        url: "/user/all-customers",
        method: "GET",
        params: params,
      }),
      providesTags: ["CUSTOMERS"],
    }),

    getMyCustomers: builder.query<GetAllUsersResponse, GetQueryParams>({
      query: (params) => ({
        url: "/user/my-customers",
        method: "GET",
        params: params,
      }),
      providesTags: ["CUSTOMERS"],
    }),

    updateUserSubscription: builder.mutation<
      IResponse<IUser>,
      {
        id: string;
        planId: string;
        customPrice?: number;
        durationInDays?: number;
      }
    >({
      query: ({ id, ...data }) => ({
        url: `/user/${id}/subscription`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["USERS"],
    }),

    disableSubscription: builder.mutation<IResponse<IUser>, string>({
      query: (id) => ({
        url: `/user/${id}/subscription-disable`,
        method: "PATCH",
      }),
      invalidatesTags: ["USERS"],
    }),

    getSubscriptionStats: builder.query<IResponse<SubscriptionStats>, void>({
      query: () => ({
        url: "/user/subscriptions/stats",
        method: "GET",
      }),
      providesTags: ["USERS"],
    }),

    getActiveSubscriptions: builder.query<IResponse<SubscriptionUser[]>, void>({
      query: () => ({
        url: "/user/subscriptions/active",
        method: "GET",
      }),
      providesTags: ["USERS"],
    }),

    getExpiredSubscriptions: builder.query<IResponse<SubscriptionUser[]>, void>(
      {
        query: () => ({
          url: "/user/subscriptions/expired",
          method: "GET",
        }),
        providesTags: ["USERS"],
      },
    ),

    getExpiringSoonSubscriptions: builder.query<
      IResponse<SubscriptionUser[]>,
      void
    >({
      query: () => ({
        url: "/user/subscriptions/expiring-soon",
        method: "GET",
      }),
      providesTags: ["USERS"],
    }),

    //  GET ME (Logged-in user's own profile)
    getMe: builder.query<IUserApiResponse, void>({
      query: () => ({
        url: "/user/me",
        method: "GET",
      }),

      providesTags: ["ME", "USER"],
    }),

    // ⭐ GET ALL TRASH
    getAllTrashUsers: builder.query<GetAllUsersResponse, GetQueryParams>({
      query: (params) => ({
        url: "/user/all-trash-users",
        method: "GET",
        params,
      }),
      providesTags: ["USERS"],
    }),

    // ⭐ TRASH UPDATE  and Restore both work
    trashUpdateUser: builder.mutation<IResponse<ILead>, { _id: string }>({
      query: ({ _id }) => ({
        url: `/user/user-trash/${_id}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { _id }) => [
        "USERS",
        { type: "USER", _id },
      ],
    }),

    // ⭐ GET ALL TRASH Customer
    getAllTrashCustomers: builder.query<GetAllUsersResponse, GetQueryParams>({
      query: (params) => ({
        url: "/user/all-trash-customers",
        method: "GET",
        params,
      }),
      providesTags: ["CUSTOMERS"],
    }),

    // ⭐ TRASH UPDATE  and Restore both work customers
    trashUpdateCustomer: builder.mutation<IResponse<IUser>, { _id: string }>({
      query: ({ _id }) => ({
        url: `/user/customer-trash/${_id}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { _id }) => [
        "CUSTOMERS",
        { type: "CUSTOMER", _id },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useRegisterMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetSingleUserQuery,
  useUpdateUserPermissionsMutation,
  useToggleSubscriptionAccessMutation,
  useGetAllUsersQuery,
  useGetMyCustomersQuery,
  useGetAllCustomersQuery,
  useGetMeQuery,
  useGetAllTrashUsersQuery,
  useUpdateUserSubscriptionMutation,
  useDisableSubscriptionMutation,

  useGetSubscriptionStatsQuery,
  useGetActiveSubscriptionsQuery,
  useGetExpiredSubscriptionsQuery,
  useGetExpiringSoonSubscriptionsQuery,
  useTrashUpdateUserMutation,

  useGetAllTrashCustomersQuery,
  useTrashUpdateCustomerMutation,
} = userApi;
