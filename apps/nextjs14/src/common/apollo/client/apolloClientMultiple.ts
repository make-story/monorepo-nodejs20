/**
 * How to quickly setup multiple Graphql endpoints in Apollo Client
 * https://hartaniyassir.medium.com/how-to-quickly-setup-multiple-graphql-endpoints-in-apollo-client-and-codegen-react-24bba2e2f941
 */
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NextLink,
  Operation,
  ApolloLink,
  useApolloClient,
  gql,
  useQuery,
} from '@apollo/client';

// Declare your endpoints
const endpoint1 = new HttpLink({
  uri: 'https://api.hashnode.com/graphql',
  // ...
});
const endpoint2 = new HttpLink({
  uri: 'endpoint2/graphql',
  // ...
});

// pass them to apollo-client config
const client = new ApolloClient({
  link: ApolloLink.split(
    operation => operation.getContext().clientName === 'endpoint2',
    endpoint2,
    endpoint1,
  ),
  cache: new InMemoryCache(),
  // ...
});

// pass client name in query/mutation
//useQuery(QUERY, {variables, context: {clientName: 'endpoint2'}})
