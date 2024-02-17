import { setCookie, getCookie, deleteCookie } from 'cookies-next';
import type { OptionsType } from 'cookies-next/lib/types';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/common/constant/cookie';

const isSeverSide = typeof window === 'undefined';

function checkIsServer(options?: OptionsType) {
  if (isSeverSide && (!options?.req || !options?.res)) {
    console.debug(
      '서버 측 호출 중입니다.\n필수 값인 "req" or "res" 값이 없습니다.',
    );
  }
}

export function getAccessToken(options?: OptionsType) {
  checkIsServer(options);
  return getCookie(ACCESS_TOKEN_KEY, options);
}

export function setAccessToken(
  value: string,
  expires: number,
  options?: OptionsType,
) {
  checkIsServer(options);
  setCookie(ACCESS_TOKEN_KEY, value, {
    ...options,
    sameSite: 'lax',
    httpOnly: true,
    expires: new Date(expires * 1000),
  });
}

export function removeAccessToken(options?: OptionsType) {
  checkIsServer(options);
  deleteCookie(ACCESS_TOKEN_KEY, options);
}

export function getRefreshToken(options?: OptionsType) {
  checkIsServer(options);
  return getCookie(REFRESH_TOKEN_KEY, options);
}

export function setRefreshToken(
  value: string,
  expires: number,
  options?: OptionsType,
) {
  checkIsServer(options);
  setCookie(REFRESH_TOKEN_KEY, value, {
    ...options,
    sameSite: 'lax',
    httpOnly: true,
    expires: new Date(expires * 1000),
  });
}

export function removeRefreshToken(options?: OptionsType) {
  checkIsServer(options);
  deleteCookie(REFRESH_TOKEN_KEY, options);
}
