import { FetchResult, GraphQLRequest } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { Observable } from '@apollo/client/utilities';
import { GraphQLError } from 'graphql';
import type { OptionsType } from 'cookies-next/lib/types';

import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  setRefreshToken,
} from '@/common/utils/auth/index';
import { initializeApollo } from '@/common/apollo/client/apolloClient';
import { REFRESH_TOKEN } from '@/common/queries/auth/auth.mutation';
import type { RefreshToken } from '@/common/queries/auth/auth.mutation';

/**
 * 토큰 재발급 request 여부
 * @param operation
 * @returns
 */
function isRefreshRequest(operation: GraphQLRequest) {
  return operation.operationName === 'refreshToken';
}

/**
 * request에 따라 토큰 값 사용
 * @param operation
 * @returns JWT 토큰
 */
function returnTokenDependingOnOperation(
  operation: GraphQLRequest,
  cookieOptions?: OptionsType,
) {
  return isRefreshRequest(operation)
    ? getRefreshToken(cookieOptions)
    : getAccessToken(cookieOptions);
}

/**
 * 토큰 재발급 및 저장소 저장
 * @returns
 */
const refreshToken = async (cookieOptions?: OptionsType) => {
  try {
    const apolloClient = initializeApollo();
    const refreshResolverResponse = await apolloClient.mutate<{
      refreshToken: RefreshToken;
    }>({
      mutation: REFRESH_TOKEN,
      variables: {
        authorizationToken: getAccessToken(cookieOptions),
        refreshInput: {
          refreshToken: getRefreshToken(cookieOptions),
        },
      },
    });
    const token = refreshResolverResponse.data;

    if (!!token?.refreshToken) {
      const { accessToken, accessExpireTime, refreshToken, refreshExpireTime } =
        token.refreshToken;

      setAccessToken(accessToken, accessExpireTime, cookieOptions);
      setRefreshToken(refreshToken, refreshExpireTime, cookieOptions);

      return accessToken;
    }

    return null;
  } catch (err) {
    removeAccessToken(cookieOptions);
    removeRefreshToken(cookieOptions);
    throw err;
  }
};

/**
 * 인증 토큰 재발급
 * 재발급 토큰이 존재하는 경우 인증 실패 시 인증 토큰을 재발급
 * @param client
 * @returns
 */
export const authErrorLink = (cookieOptions?: OptionsType) =>
  onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        switch (err.extensions.code) {
          case 'UNAUTHENTICATED':
            // ignore 401 error for a refresh request
            if (isRefreshRequest(operation)) return;

            const observable = new Observable<FetchResult<Record<string, any>>>(
              observer => {
                // used an annonymous function for using an async function
                (async () => {
                  try {
                    const accessToken = await refreshToken(cookieOptions);
                    if (!accessToken) {
                      throw new GraphQLError('Empty AccessToken');
                    }

                    // Retry the failed request
                    const subscriber = {
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer),
                    };

                    forward(operation).subscribe(subscriber);
                  } catch (err) {
                    observer.error(err);
                  }
                })();
              },
            );

            return observable;
        }
      }
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

/**
 * 인증 header 값 추가
 */
export const authLink = (cookieOptions?: OptionsType) =>
  setContext((operation, { headers }) => {
    const token = returnTokenDependingOnOperation(operation, cookieOptions);
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });
