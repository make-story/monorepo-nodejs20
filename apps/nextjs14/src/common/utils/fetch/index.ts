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

export const getResponseData = <T extends ResponseData = ResponseData>(
  params: Promise<T> | AxiosResponse | AxiosError,
) => {
  // 현재 함수를 파이프라인 또는 then 으로 주입했을 경우
  // 또는 합성함수로 주입했을 경우
  if (params instanceof Promise) {
    return getPromiseData<T>(params);
  }
};
