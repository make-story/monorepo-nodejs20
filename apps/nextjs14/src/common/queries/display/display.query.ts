import { gql } from '@apollo/client';

export const QUERY_DISPLAY_TEST = gql`
  query DisplayTest($id: BigInt!) {
    displayTest(id: $id) {
      test
    }
  }
`;
