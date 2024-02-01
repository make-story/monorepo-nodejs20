/**
 * API 정보는 라이브러리 외부에 선언되고,
 * 라이브러리 사용시 값이 주입되는 것이 맞으나,
 * 내부용 라이브러리로 우선 안에 선언
 */

// 각 API별 구분 값
export const API_TYPE = {
  TEST: 'TEST', // 테스트 데이터 URL
  DEFAULT: 'DEFAULT',
} as const;

// 기본 공통 URL (baseUrl)
export const BASE_URL = {
  [API_TYPE.TEST]: 'https://jsonplaceholder.typicode.com',
  [API_TYPE.DEFAULT]:
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || '',
} as const;

// 각 API별 Path
export const URL_PATH = {
  [API_TYPE.TEST]: {
    LIST: '/todos',
  },
  [API_TYPE.DEFAULT]: {},
} as const;
