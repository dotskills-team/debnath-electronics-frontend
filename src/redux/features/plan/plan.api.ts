import { GetQueryParams, IResponse } from "@/types";
import { baseApi } from "../baseApi";
import { IPlan } from "@/types/plan";

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPlan: builder.mutation<
      IResponse<IPlan>,
      Partial<IPlan>
    >({
      query: (data) => ({
        url: "/plan",
        method: "POST",
        data,
      }),
      invalidatesTags: ["PLANS"],
    }),

    getAllPlans: builder.query<
      IResponse<IPlan[]>,
      GetQueryParams
    >({
      query: (params) => ({
        url: "/plan",
        method: "GET",
        params,
      }),
      providesTags: ["PLANS"],
    }),

    getSinglePlan: builder.query<
      IResponse<IPlan>,
      string
    >({
      query: (id) => ({
        url: `/plan/${id}`,
        method: "GET",
      }),
      providesTags: (_r, _e, id) => [
        { type: "PLAN", id },
      ],
    }),

    updatePlan: builder.mutation<
      IResponse<IPlan>,
      {
        id: string;
        data: Partial<IPlan>;
      }
    >({
      query: ({ id, data }) => ({
        url: `/plan/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["PLANS"],
    }),

    deletePlan: builder.mutation<
      IResponse<null>,
      string
    >({
      query: (id) => ({
        url: `/plan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PLANS"],
    }),

    getPlanStats: builder.query<
      IResponse<{
        totalPlans: number;
        activePlans: number;
        inactivePlans: number;
      }>,
      void
    >({
      query: () => ({
        url: "/plan/stats",
        method: "GET",
      }),
      providesTags: ["PLANS"],
    }),
  }),
});

export const {
  useCreatePlanMutation,
  useGetAllPlansQuery,
  useGetSinglePlanQuery,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetPlanStatsQuery,
} = planApi;