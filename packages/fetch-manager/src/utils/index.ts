import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import {
  FetchConfig,
  FetchPayload,
  FetchManagerParams,
  FetchInterceptor,
  ApplyAxiosInterceptor,
} from '../types/index';
export { default as paramsSerializer } from './paramsSerializer';

/**
 * Axios 인스턴스여부 확인 (타입가드)
 * @param value
 * @returns
 */
export function isAxiosInstance(value: any): value is AxiosInstance {
  return (
    typeof (value as AxiosInstance)?.interceptors?.request?.use === 'function'
  );
}

/**
 * axios 인스턴스 생성
 */
export const createAxiosInstance = (config?: FetchConfig): AxiosInstance => {
  const instance = axios.create({
    // axios config 공통 설정
    ...config,
    headers: {
      ...config?.headers,
    },
  });
  return instance;
};

/**
 * axios 인스턴스에 config 주입
 */
export const applyAxiosConfig = (
  instance: AxiosInstance,
  config?: FetchConfig,
) => {
  if (isAxiosInstance(instance) && config) {
    Object.assign(instance.defaults, {
      ...instance.defaults,
      ...config,
      headers: {
        ...instance.defaults.headers,
        ...config?.headers,
      },
    });
  }
};

/**
 * axios 인스턴스에 interceptor 추가
 * (주의! 실행할 때마다 콜백함수 계속 추가됨, 즉 axios 내부적으로 동일 콜백이 계속 쌓이지 않도록 주의 필요!)
 *
 * axios 인터셉터가 등록되면, id (고유값)을 반환함
 * (axios 내부 코드를 보면 인터셉터를 배열에 push 하고 해당 Index 를 반환하는 것)
 */
export function applyAxiosInterceptor(
  instance: AxiosInstance,
  interceptors: {
    request?: FetchInterceptor[];
    response?: FetchInterceptor[];
  },
  params: FetchManagerParams = {},
): ApplyAxiosInterceptor {
  const result: ApplyAxiosInterceptor = { request: [], response: [] };
  const setInterceptor = (interceptor: FetchInterceptor) =>
    interceptor(instance, params);

  if (isAxiosInstance(instance)) {
    result.request = interceptors?.request?.map(setInterceptor) || [];
    result.response = interceptors?.response?.map(setInterceptor) || [];
  }

  return result;
}

/**
 * axios 인스턴스에 interceptor 제거
 */
export function ejectAxiosInterceptor(
  instance: AxiosInstance,
  interceptors: ApplyAxiosInterceptor,
) {
  if (isAxiosInstance(instance)) {
    !!interceptors?.request?.length &&
      interceptors.request.forEach(interceptor =>
        instance.interceptors.request.eject(interceptor),
      );
    !!interceptors?.response?.length &&
      interceptors.response.forEach(interceptor =>
        instance.interceptors.response.eject(interceptor),
      );
  }
}

/**
 * axios 인스턴스에 interceptor 모두 제거
 */
export function clearAxiosInterceptor(instance: AxiosInstance) {
  if (isAxiosInstance(instance)) {
    instance.interceptors.request.clear();
    instance.interceptors.response.clear();
  }
}
