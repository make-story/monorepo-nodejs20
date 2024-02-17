import { ApolloLink, HttpLink, NextLink, Operation } from '@apollo/client';

/**
 * Apollo (그래프QL) 서버 접근 URL
 */
export const httpLink = new HttpLink({
  //uri: 'https://countries.trevorblades.com',
  //uri: 'http://localhost:9001/api',
  //uri: '/api/v1', // 상대경로의 경우, 서버사이드에서 호출시 경로 오류가 발생될 수 있다!
  uri: `${process.env.NEXT_PUBLIC_SERVICE_HOSTNAME}/api/graphql/v1`,
  credentials: 'include',
});
