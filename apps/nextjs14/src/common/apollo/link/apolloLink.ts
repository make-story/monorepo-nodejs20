import { ApolloLink, HttpLink, NextLink, Operation } from '@apollo/client';

/**
 * Apollo 통신간 인증(토큰) 정보
 */
export const authorizationLink = new ApolloLink(
  (operation: Operation, forward: NextLink) => {
    operation.setContext(({ headers = {} }) => {
      console.log('authorizationLink headers', headers);
      // Next.js 의 경우
      // 서버사이드와 클라이언트 사이드를 구분해서
      // 토큰 정보를 가져와
      // HTTP Header 에 넣어주어야 한다.

      return {
        headers: {
          ...headers,
          //Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzaWduSW5Tb2NpYWxUeXBlIjoiS0FLQU8iLCJpc3MiOiJNdWZmaW4iLCJzb2NpYWxBY2NvdW50SWQiOjUwMDUwMDMxMCwiZXhwIjoxNjkyNzc1ODUzLCJ0eXBlIjoiTk9STUFMIiwiaWF0IjoxNjg3NTA1NDUzLCJ1c2VySWQiOjUwMDUwMDI4NSwibm9uY2UiOiI0R3FDanJKaGp6In0.dsZf3L0HkgolC_TkX-HuCi_Kcev8uDNcBEHqC0IB8K0`,
        },
      };
    });
    return forward ? forward(operation) : null;
  },
);

/**
 * Apollo (그래프QL) 서버 접근 URL
 */
export const httpLink = new HttpLink({
  //uri: 'https://countries.trevorblades.com',
  //uri: 'http://localhost:9001/api',
  //uri: '/api/v1', // 상대경로의 경우, 서버사이드에서 호출시 경로 오류가 발생될 수 있다!
  uri: 'http://localhost:9040/api/v1',
  credentials: 'include',
});

export default ApolloLink.from([authorizationLink, httpLink]);
