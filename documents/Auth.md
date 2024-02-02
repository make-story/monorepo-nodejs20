# NextAuth.js

https://velog.io/@s_soo100/Next.js-13-Next-auth-%EC%BB%A4%EC%8A%A4%ED%85%80-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%ED%8E%98%EC%9D%B4%EC%A7%80-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0

https://medium.com/@deadlyunicorn/authentication-for-next-js-13-using-auth-js-app-router-4fee73b50da9

https://medium.com/ascentic-technology/authentication-with-next-js-13-and-next-auth-9c69d55d6bfd

https://velog.io/@s_soo100/Next.js-13Next.js-13.2%EB%B2%84%EC%A0%BC%EC%97%90-Next-auth-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0

13.2로 업데이트 되고 프로젝트 구성이 pages에서 app 디렉토리로 넘어감에 따라 next-auth도 app디렉토리를 지원한다.

https://next-auth.js.org/configuration/initialization#route-handlers-app
https://next-auth.js.org/configuration/nextjs

기존과 비슷하게 app디렉토리 내부에 api/auth/[...nextauth] 디렉토리 안에route.ts 파일을 만든다.

/app/api/auth/[...nextauth]/route.ts

```jsx
import NextAuth from 'next-auth';

const handler = NextAuth({
  // ...
});

export { handler as GET, handler as POST };
```

# Providers

https://next-auth.js.org/providers/
