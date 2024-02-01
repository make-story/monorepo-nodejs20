/**
 * fetch manager
 * axios 활용
 */
import {
  isAxiosInstance,
  createAxiosInstance,
  applyAxiosConfig,
  applyAxiosInterceptor,
} from './utils';
import {
  setErrorLoggerInterceptorResponse,
  setTokenInterceptorRequest,
  setTokenInterceptorResponse,
} from './interceptors';
import { FetchManagerParams } from './types/index';
import { API_TYPE } from './constant';
import { getAxiosConfig } from './config';

/**
 * API 별 인스턴스
 */
export const test = (params: FetchManagerParams = {}) => {
  // 인스턴스 생성
  const instance = createAxiosInstance(getAxiosConfig(API_TYPE.TEST, params));

  // 인터셉터 주입
  const interceptors = applyAxiosInterceptor(
    instance,
    {
      request: [setTokenInterceptorRequest],
      response: [
        setErrorLoggerInterceptorResponse,
        setTokenInterceptorResponse,
      ],
    },
    params,
  );

  return { instance, interceptors };
};

/**
 * 모든 영역 API 인스턴스 한번에 생성
 */
export const createFetchManager = (params: FetchManagerParams = {}) => {
  if (params?.test) {
    console.log('createFetchManager', params);
  }

  // 각 API 별 axios 인스턴스 생성, config 설정, 인터셉터 주입
  return {
    [API_TYPE.TEST]: test(params).instance,
  } as const;
};
export type FetchManager = ReturnType<typeof createFetchManager>;
