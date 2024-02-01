/**
 * https://jaello-world.hashnode.dev/axios-interceptors-with-typescript
 */
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { Action, AnyAction, Store } from '@reduxjs/toolkit';

import { API_TYPE } from '../constant/index';
import { FetchManager } from '../index';

// API Type
export type TypedApiType = (typeof API_TYPE)[keyof typeof API_TYPE];

// Context Provider props 타입
export type FetchProviderProps<S = any> = { store: S };

// axios config 에 추가되는 설정 값
// https://axios-http.com/kr/docs/req_config
//export interface FetchConfig extends AxiosRequestConfig {
export interface FetchConfig extends AxiosRequestConfig {
  headers?: {
    Authorization?: string;
  };
}

// axios 파라미터
// axios({ ... }: FetchParams)
//export type FetchParams = FetchConfig;

// payload 파라미터 (추가 옵션)
export interface Authorize {
  token?: string | null; // 인증토큰
}
export interface FetchPayload extends Authorize {
  accessToken?: string | null;
}

// FetchManager 파라미터
export interface FetchManagerParams {
  config?: FetchConfig; // axios config
  store?: FetchProviderProps['store'] | null; // 스토어
  state?: any; // 스토어 상태
  payload?: FetchPayload; // 추가 파라미터
  test?: boolean; // 테스트 전용
}

// axios 인터셉터
export type FetchInterceptor = (
  instance: AxiosInstance,
  params?: FetchManagerParams,
) => number;
export type ApplyAxiosInterceptor = { request?: number[]; response?: number[] };

// 리덕스 사가
export type ActionWithFetchManager<A extends Action = AnyAction> = A & {
  fetchManager: FetchManager;
};
