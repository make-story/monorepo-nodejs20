import { gql } from '@apollo/client';

export type AccessToken = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshToken = {
  accessToken: string;
  refreshToken: string;
  accessExpireTime: number;
  refreshExpireTime: number;
};

/**
 * 토큰 발급 gql
 */
export const CREATE_TOKEN = gql``;

/**
 * 토큰 재발급 gql
 */
export const REFRESH_TOKEN = gql``;

/**
 * 회원가입 gql
 */

export const SIGN_UP_BY_SOCIAL = gql``;
