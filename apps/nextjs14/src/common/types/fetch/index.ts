/**
 * axios 응답값 타입
 */
import { AxiosResponse, AxiosResponseHeaders, AxiosRequestConfig } from 'axios';

/**
 * 여러 API 응답에서 공통된 구조 타입 예시
 */
export interface CommonResponse<T = any> {
  code: 'SUCCESS' | 'ERROR' | 'FAIL';
  data?: T;
  message: string;
  statusCode: number;
}

export type ResponseData<T = any> = AxiosResponse<CommonResponse<T>>;
