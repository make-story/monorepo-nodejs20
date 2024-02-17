import { gql } from '@apollo/client';

/**
 * API 응답 데이터 구조(인터페이스) 지정
 */
export const QUERY_BOOKS = gql`
  query Books {
    books {
      title
      author
    }
  }
`;
