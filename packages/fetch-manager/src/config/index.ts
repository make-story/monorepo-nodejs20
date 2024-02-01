/**
 * axios config 관련 코드
 */
import { TypedApiType, FetchManagerParams } from '../types/index';
import { BASE_URL, API_TYPE } from '../constant/index';

// axios 기본 설정 값
export const axiosDefaults = {
  headers: {
    'Content-Type': 'application/json; charset=utf8',
    'Accept-Language': 'ko',
  },
  //withCredentials: true, // 쿠키포함 (origin 다른 통신) - 서버단 'Access-Control-Allow-Credentials : true' 설정 필요, 'Access-Control-Allow-Origin : "*"' 경우 에러발생
  timeout: typeof window === 'undefined' ? 10000 : 60000, // Server Side: 10초, Client Side 60초
};

// 각 영역별 설정 값 반환
export const getAxiosConfig = (
  apiType: TypedApiType,
  { config = {}, store = null, state = null }: FetchManagerParams,
) => {
  // 기본값
  config = {
    ...axiosDefaults,
    ...config,
    headers: {
      ...axiosDefaults.headers,
      ...config.headers,
    },
  };

  // state
  if (store) {
    state = store?.getState();
  }
  if (state) {
    const { token = '' } = state?.auth || {};
    const headers: any = {};

    // 인증토큰
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    config = {
      ...config,
      headers: {
        ...config.headers,
        ...headers,
      },
    };
  }

  // 각 영역별
  switch (apiType) {
    // 기본 설정
    case API_TYPE.TEST:
    default:
      return {
        baseURL: BASE_URL.TEST,
        ...config,
        headers: {
          ...config.headers,
          'x-api-key': '',
        },
      };
  }
};
