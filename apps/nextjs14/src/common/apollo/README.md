# GraphQL

## Mext.js 13

https://www.apollographql.com/blog/how-to-use-apollo-client-with-next-js-13

An example of data fetching inside server components

```tsx
export default async function Page() {
  const data = await fetch(
    'https://main--time-pav6zq.apollographos.net/graphql',
    {
      method: 'POST',
      body: JSON.stringify({
        query: '{ now(id: "1") }',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then(res => res.json());

  return <main>{data.now}</main>;
}
```

```bash
$ npm install @apollo/client@rc @apollo/experimental-nextjs-app-support
```

```tsx
// lib/client.js
import { HttpLink } from '@apollo/client';
import {
  NextSSRInMemoryCache,
  NextSSRApolloClient,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';

export const { getClient } = registerApolloClient(() => {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: new HttpLink({
      uri: 'https://main--time-pav6zq.apollographos.net/graphql',
    }),
  });
});
```

```tsx
// app/page.js
import { getClient } from '@/lib/client';

import { gql } from '@apollo/client';

const query = gql`
  query Now {
    now(id: "1")
  }
`;

export default async function Page() {
  const { data } = await getClient().query({ query });

  return <main>{data.now}</main>;
}
```

Revalidating GraphQL requests

```tsx
// app/page.tsx
import { getClient } from '@/lib/client';

import { gql } from '@apollo/client';

const query = gql`
  query Now {
    now(id: "1")
  }
`;

export default async function Page() {
  const { data } = await getClient().query({
    query,
    context: {
      fetchOptions: {
        next: { revalidate: 5 },
      },
    },
  });

  return <main>{data.now}</main>;
}
```

Client components

```tsx
'use client';

import { useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr';

import { gql } from '@apollo/client';

const query = gql`
  query Now {
    now(id: "1")
  }
`;

export default function Page() {
  const { data } = useSuspenseQuery(query);

  return <main>{data.now}</main>;
}
```

```tsx
// lib/apollo-provider.js
'use client';

import { HttpLink } from '@apollo/client';
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';

function makeClient() {
  const httpLink = new HttpLink({
    uri: 'https://main--time-pav6zq.apollographos.net/graphql',
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
```

```tsx
// app/layout.js
import { ApolloWrapper } from '/@lib/apollo-wrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
```
