/**
 * axios interceptors 관련 코드
 * https://www.timegambit.com/blog/digging/axios/01
 */
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios';

import {
  FetchInterceptor,
  FetchManagerParams,
  FetchConfig,
} from '../types/index';

/**
 * 로그
 */
export const setErrorLoggerInterceptorResponse: FetchInterceptor = (
  instance,
  { payload = {}, store = null, state = null }: FetchManagerParams = {},
) => {
  return instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError | Error): Promise<AxiosError> => {
      try {
        if (axios.isAxiosError(error)) {
          const { message } = error;
          const { method, url } = error.config as AxiosRequestConfig;
          const { statusText, status } =
            (error.response as AxiosResponse) ?? {};

          console.error(
            `🚨 [API] ${method?.toUpperCase()} ${url} | Error ${status} ${message}`,
          );

          switch (status) {
            case 401: {
              // "Login required"
              break;
            }
            case 403: {
              // "Permission denied"
              break;
            }
            case 404: {
              // "Invalid request"
              break;
            }
            case 500: {
              // "Server error"
              break;
            }
            default: {
              // "Unknown error occurred"
              break;
            }
          }

          if (status === 401) {
            // Delete Token & Go To Login Page if you required.
            sessionStorage.removeItem('token');
          }
        }
      } catch (error: any) {
        //console.log(error?.message);
      }

      return Promise.reject(error);
    },
  );
};

/**
 * 통합인증 토큰 유효성 확인(쿠키검사)
 */
export const setTokenInterceptorRequest: FetchInterceptor = (
  instance,
  { payload = {}, store = null, state = null }: FetchManagerParams = {},
) => {
  if (store) {
    state = store?.getState();
  }

  // interceptor
  return instance.interceptors.request.use(
    (axiosConfig: InternalAxiosRequestConfig<FetchConfig>) => {
      // ...

      return axiosConfig;
    },
  );
};

/**
 * 통합인증 토큰 유효성 확인(갱신여부, 만료여부 등)
 */
export const setTokenInterceptorResponse: FetchInterceptor = (
  instance,
  { payload = {}, store = null, state = null }: FetchManagerParams = {},
) => {
  if (store) {
    state = store?.getState();
  }

  // interceptor
  return instance.interceptors.response.use((response: AxiosResponse) => {
    // ...

    return response;
  });
};
