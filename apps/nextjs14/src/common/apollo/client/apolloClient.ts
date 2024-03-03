/**
 * 개발에 참고한 자료
 * 서버의 캐시를 클라이언트로 전달하여 이를 클라이언트 캐시에 통합할 수 있도록 설정
 * (Next js에서 권장하는 방법과 Apollo에서 권장하는 방법이 각각 다름, 아래 코드는 Next.js 에서 권장하는 방법과 비슷함) - 23.12 기준
 * https://velog.io/@2ast/Next-Next%EC%97%90%EC%84%9C-Apollo-Client-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
 * https://wpengine.com/builders/apollo-client-cache-rehydration-in-next-js
 * https://www.apollographql.com/blog/apollo-client/next-js/building-a-next-js-app-with-slash-graphql/
 *
 * 공식자료
 * https://github.com/vercel/next.js/tree/deprecated-main/examples/api-routes-apollo-server-and-client
 */
import { useMemo } from 'react';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import type { OptionsType } from 'cookies-next/lib/types';

import { authLink, authErrorLink } from '@/common/apollo/link/authLink';
//import { httpLink } from '@/common/apollo/link/httpLink';

// getStaticProps (또는 getServerSideProps) 리턴값 캐시관련 키
export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

/**
 * apollo client 인스턴스 (브라우저, 즉 클라이언트 환경에서 사용)
 */
let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

/**
 * 새로운 apollo client 객체를 만들어 리턴해주는 역할을 수행
 *
 * 기존 코드 참고
 * webview.git/workspaces/client/src/configs/apolloLink.ts
 * webview.git/workspaces/client/src/index.tsx
 */
export function createApolloClient(cookieOptions?: OptionsType) {
  // https://www.apollographql.com/docs/react/api/core/ApolloClient/
  return new ApolloClient({
    // https://www.apollographql.com/docs/react/caching/overview/
    cache: new InMemoryCache({
      addTypename: false,
    }),
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([
      authLink(cookieOptions),
      authErrorLink(cookieOptions),
      //httpLink(cookieOptions),
    ]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        nextFetchPolicy: 'no-cache',
      },
      query: {
        fetchPolicy: 'no-cache',
      },
      mutate: {
        fetchPolicy: 'no-cache',
      },
    },
  });
}

/**
 * apollo client 를 초기화해주는 함수
 */
export function initializeApollo(
  cookieOptions?: OptionsType,
  initialState?: NormalizedCacheObject,
) {
  const _apolloClient = apolloClient ?? createApolloClient(cookieOptions);

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    //_apolloClient.cache.restore({ ...existingCache, ...initialState });
    const data = merge(initialState, existingCache, {
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter(d => sourceArray.every(s => !isEqual(d, s))),
      ],
    });
    _apolloClient.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  // 서버사이드의 경우 전역변수 사용안함 (주의! 메모리 누수)
  if (typeof window === 'undefined') return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

/**
 * apollo client 와 object 를 paramter 로 받아 새로운 object 를 반환
 * apollo client 에서 cache 를 추출한 뒤, object 의 props 속성에 추가해주는 역할을 수행
 * Next.js 의 getStaticProps (또는 getServerSideProps) 의 return 부분에서 호출되므로, object 의 형태도 getStaticProps (또는 getServerSideProps) 의 return type 을 따른다.
 */
export function addApolloState(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: any,
) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

/**
 * parameter 로 받은 pageProps 를 인수로 하여 initializeApollo 를 호출
 * 이때 initialzeApollo 에 argument 를 주어 호출했으니, 기존 cache 와 새로운 cache 가 병합된 apollo client 가 반환된다.
 */
export function useApollo(pageProps: any) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}
