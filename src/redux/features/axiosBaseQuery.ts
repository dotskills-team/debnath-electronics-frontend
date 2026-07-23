import { axiosInstance } from "@/lib/axios";
import { getCookie } from "@/utils/tokenHandlers";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosError, AxiosRequestConfig } from "axios";

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers }) => {
    const accessToken = await getCookie("accessToken");
    try {
      const result = await axiosInstance({
        url: url,
        method,
        data,
        params,
        headers: {
          ...headers,
          ...(accessToken ? { Authorization: accessToken } : {}),
        },
        withCredentials: true,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      if (typeof window !== "undefined" && err.response?.status === 401) {
        // Remove invalid token
        document.cookie =
          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        // Avoid redirect loop
        if (!window.location.pathname.startsWith("/login")) {
          window.location.replace(
            `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
          );
        }
      }

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
