# Next.js 예제 (redux, styled-components 등 적용예제)

https://github.com/vercel/next.js/tree/canary/examples

Next.js 13 이상부터 컴포넌트는 기본 서버 컴포넌트로 작동

https://nextjs.org/docs/app/building-your-application/routing#the-app-router

# SSR / SSG / ISR 관련

Next.js 13 버전부터는 모든 컴포넌트가 서버 컴포넌트이기 때문에  
12 버전에서 사용하던 getStaticProps 함수나 getServerSideProps 함수가 필요 없어졌습니다.

https://mycodings.fly.dev/blog/2022-11-16-nextjs-13-how-to-ssg-isr-and-not-found

https://nextjs.org/blog/next-13#data-fetching

https://nextjs.org/docs/app/api-reference/functions/fetch

https://nextjs.org/docs/pages/building-your-application/deploying/static-exports

```javascript
// Static Site Generation (SSG)
// This request should be cached until manually invalidated.
// Similar to `getStaticProps`.
// `force-cache` is the default and can be omitted.
fetch(URL, { cache: 'force-cache' }); // 'force-cache'라고 옵션을 주면 이름에서도 알 수 있듯이 캐시를 강제한다는 뜻이기 때문에 정적 사이트로 만들라는 의미

// Server-Side Rendering (SSR)
// This request should be refetched on every request.
// Similar to `getServerSideProps`.
fetch(URL, { cache: 'no-store' }); // 캐시를 만들지 말라는 뜻으로 무조건 서버사이드로 작동

// Incremental Static Regeneration (ISR)
// This request should be cached with a lifetime of 10 seconds.
// Similar to `getStaticProps` with the `revalidate` option.
fetch(URL, { next: { revalidate: 10 } }); // 10초마다 캐시를 갱신
```

## 파일명 규칙

https://nextjs.org/docs/app/building-your-application/routing#file-conventions

https://velog.io/@asdf99245/Next.js-app-router-%EA%B3%B5%EC%8B%9D%EB%AC%B8%EC%84%9C-%EC%A0%95%EB%A6%AC

- layout
  세그먼트 및 해당 하위 항목에 대한 공유 UI
- page
  경로의 고유한 UI 및 경로에 공개적으로 액세스 가능
- loading
  세그먼트 및 해당 하위 항목에 대한 UI 로드 중
- not-found
  세그먼트 및 해당 하위 항목에 대한 UI를 찾을 수 없습니다.
- error
  세그먼트 및 해당 하위 항목에 대한 오류 UI
- global-error
  전역 오류 UI
- route
  서버 측 API 엔드포인트
- template
  전문적으로 다시 렌더링된 레이아웃 UI
- default
  병렬 경로 에 대한 대체 UI

## 서버 컴포넌트, 클라이언트 컴포넌트

https://www.rldnd.net/nextjs-app-directory-

Next.js 13에서 `모든 컴포넌트들은 Server Component 를 기본적으로 사용`하고 있다.  
`Client Component 를 사용하고 싶다면 하기와 같이 ‘use client’를 사용`하면 된다.

추가로 서버에서만 사용하고 싶은 코드, 즉 클라이언트단에서 사용하는 것을 방지하고 싶은 경우

```bash
$ yarn add server-only
```

```jsx
import 'server-only';

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  });

  return res.json();
}
```

https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

## Server Component 에서의 async await

```jsx
async function getData() {
  const res = await fetch('https://api.example.com/...');
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Page() {
  const data = await getData();

  return <main></main>;
}
```

## Client Component 에서의 use

Promise 를 await 와 같이 사용할 수 있는 방법인 function use  
현재 fetch 를 use 와 함께 쓰는 것은 리렌더를 유발하기 때문에 SWR / React Query 쓰는 것을 추천

```javascript
// Static Data Fetching

// SSG
fetch('https://...'); // cache: force-cache => 무제한 캐시!

// ISR
fetch('https://...', { next: { revalidate: 10 } }); // revalidate second 마다 캐시 초기화

// SSR
fetch('https://...', { cache: 'no-store' }); // 매 요청시마다 새로
```

## Data Fetch 패턴

https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating

## next 13 이전의 getStaticPaths 의 기능

https://nextjs.org/docs/app/api-reference/functions/generate-static-params

## API 라우트

https://nextjs.org/docs/app/building-your-application/routing/route-handlers

## Next.js 13.4 Server Actions

https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

https://velog.io/@ckstn0777/Next.js-13.4-Server-Actions%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C

함수에 "use server"를 추가하면  
함수를 호출하고 결과를 기다리는 것만큼 클라이언트에서 쉽게 호출할 수 있는 서버 함수

next.config.js 설정 활성화

```javascript
module.exports = {
  experimental: {
    serverActions: true,
  },
};
```

```jsx
// app/actions.js
'use server';

export async function addItem(data) {
  const cartId = cookies().get('cartId')?.value;
  await saveToDb({ cartId, data });
}
```

```jsx
// app/add-to-cart.js
'use client';

import { addItem } from './actions.js';

// Server Action being called inside a Client Component
export default function AddToCart({ productId }) {
  return (
    <form action={addItem}>
      <button type='submit'>Add to Cart</button>
    </form>
  );
}
```

## 빌드 결과물

https://nextjs.org/docs/pages/api-reference/next-config-js/output

## Typescript 에서 JavaScript npm 모듈 import 시 오류를 해결하는 방법 (NPM 모듈 중 타입 선언이 없는 모듈의 경우)

https://kimchanjung.github.io/programming/2020/07/05/typescipt-import-js-module-error/

d.ts 파일 생성

```tsx
// @types/모듈명/index.d.ts
declare module '모듈명';
```

d.ts 파일 생성 위치

```
app /src
    /node_modules
    /assets
    /@types <= 폴더를 생성
           /모듈명 <= 모듈명과 같은 폴더명을 생성
                /index.d.ts <= index.d.ts파일 생성
```

tsconfig 확인

```json
{
  "compilerOptions": {
    "typeRoots": ["./@types", "./node_modules/@types"]
  }
}
```

# Server Side Redux Dispatch

https://stackoverflow.com/questions/75582084/how-can-i-get-redux-state-in-a-next-13-server-component
