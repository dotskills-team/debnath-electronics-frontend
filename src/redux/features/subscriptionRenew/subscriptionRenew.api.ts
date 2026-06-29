/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "../baseApi";

import {
  IApproveRenewPayload,
  ICreateRenewPayload,
  IRejectRenewPayload,
  IRenewListResponse,
  ISubscriptionRenew,
} from "@/types/subscriptionRenew";

import { IResponse } from "@/types";
import { GetQueryParams } from "@/types";

export const subscriptionRenewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createRenewRequest: builder.mutation<
      IResponse<ISubscriptionRenew>,
      ICreateRenewPayload
    >({
      query: (data) => ({
        url: "/subscription-renew/create",
        method: "POST",
        data,
      }),
      invalidatesTags: ["SUBSCRIPTION_RENEW"],
    }),

    getAllRenewRequests: builder.query<IRenewListResponse, GetQueryParams>({
      query: (params) => ({
        url: "/subscription-renew/all",
        method: "GET",
        params,
      }),
      providesTags: ["SUBSCRIPTION_RENEW"],
    }),

    getMyRenewRequests: builder.query<IRenewListResponse, GetQueryParams>({
      query: (params) => ({
        url: "/subscription-renew/my-requests",
        method: "GET",
        params,
      }),
      providesTags: ["SUBSCRIPTION_RENEW"],
    }),

    getSingleRenewRequest: builder.query<IResponse<ISubscriptionRenew>, string>(
      {
        query: (id) => ({
          url: `/subscription-renew/${id}`,
          method: "GET",
        }),
        providesTags: (result, error, id) => [
          {
            type: "SUBSCRIPTION_RENEW",
            id,
          },
        ],
      },
    ),

    approveRenewRequest: builder.mutation<
      IResponse<ISubscriptionRenew>,
      {
        id: string;
        data: IApproveRenewPayload;
      }
    >({
      query: ({ id, data }) => ({
        url: `/subscription-renew/approve/${id}`,
        method: "PATCH",
        data,
      }),

      invalidatesTags: ["SUBSCRIPTION_RENEW", "USERS"],
    }),

    rejectRenewRequest: builder.mutation<
      IResponse<ISubscriptionRenew>,
      {
        id: string;
        data: IRejectRenewPayload;
      }
    >({
      query: ({ id, data }) => ({
        url: `/subscription-renew/reject/${id}`,
        method: "PATCH",
        data,
      }),

      invalidatesTags: ["SUBSCRIPTION_RENEW"],
    }),

    getRenewStats: builder.query<any, void>({
      query: () => ({
        url: "/subscription-renew/stats",
        method: "GET",
      }),

      providesTags: ["SUBSCRIPTION_RENEW"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateRenewRequestMutation,

  useGetAllRenewRequestsQuery,

  useGetMyRenewRequestsQuery,

  useGetSingleRenewRequestQuery,

  useApproveRenewRequestMutation,

  useRejectRenewRequestMutation,

  useGetRenewStatsQuery,
} = subscriptionRenewApi;
