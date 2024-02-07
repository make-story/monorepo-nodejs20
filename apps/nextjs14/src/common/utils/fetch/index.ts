/**
 * fetch API 공통 유틸
 */
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';

import { CommonResponse, ResponseData } from '@/common/types/fetch';

export const getResolveData = (response: ResponseData) => response?.data;
export const getRejectData = (error: AxiosError) => ({ error });
export const getPromiseData = <T extends ResponseData = ResponseData>(
  params: Promise<T>,
) => {
  return params.then(getResolveData).catch(getRejectData);
};

// fetch-manager 응답(promise) 또는 then / catch 대응
export const getResponseData = <T extends ResponseData = ResponseData>(
  params: Promise<T> | AxiosResponse | AxiosError,
) => {
  if (params instanceof Promise) {
    return getPromiseData<T>(params);
  } else {
    // ...
  }
};
