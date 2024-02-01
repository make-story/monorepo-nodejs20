/**
 * RTK Query baseQuery 대응
 * https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#axios-basequery
 * https://redux-toolkit.js.org/rtk-query/usage-with-typescript
 */
import type { BaseQueryFn, BaseQueryApi } from '@reduxjs/toolkit/query';
import { AxiosRequestConfig, AxiosError } from 'axios';
//import type { AxiosRequestConfig, AxiosError } from 'axios';

import { BASE_URL, API_TYPE } from '../constant/index';
import { createFetchManager, FetchManager } from '../index';

export const fetchManagerBaseQuery = ({
  baseUrl = BASE_URL.TEST,
  apiType = API_TYPE.TEST,
  fetchManager,
}: {
  baseUrl?: string;
  apiType?: keyof FetchManager;
  fetchManager?: FetchManager | undefined;
} = {}): BaseQueryFn<
  {
    url: string;
    method: AxiosRequestConfig['method'];
    data?: AxiosRequestConfig['data'];
    params?: AxiosRequestConfig['params'];
    headers?: AxiosRequestConfig['headers'];
  },
  unknown,
  unknown
> => {
  return async (
    { url, method, data, params, headers }: any = {},
    api: BaseQueryApi,
    extraOptions?: { shout?: boolean },
  ) => {
    try {
      if (!fetchManager) {
        fetchManager = createFetchManager({ state: api?.getState() });
      }
      const result = await fetchManager[apiType]({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
};
