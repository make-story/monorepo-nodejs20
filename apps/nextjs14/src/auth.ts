/**
 * NextAuth 설정
 */
//import { authenticate } from '@/services/authService';
import axios from 'axios';
import NextAuth from 'next-auth';
import type { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';
import NaverProvider from 'next-auth/providers/naver';

/**
 * authOptions
 * 
 * Next.js 13이상, 서버 측 API 엔드포인트(route.ts) 파일에서 authOptions 를 export 할 경우, 빌드시 아래와 같은 에러가 발생함
 * https://github.com/vercel/next.js/discussions/50511
 * Type error: Route "src/app/api/auth/[...nextauth]/route.ts" does not match the required types of a Next.js Route.
  "authOptions" is not a valid Route export field.
  즉, auth.ts (다른 파일명 상관없음) 라는 별도 파일로 authOptions 코드를 분리하고, route.ts 파일에서 import 하는 방식으로 사용
 */
export const authOptions: AuthOptions = {
  providers: [
    /*NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || "",
      clientSecret: process.env.NAVER_CLIENT_SECRET || "",
    }),*/
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // authorize 은 credentials 에 입력한 값을 통해 로그인이 가능한지 가능하지 않은지 판단하여 제어할 수 있는 함수이다.
      // credentials 를 통해 개발자가 어떤 정보를 로그인 시 받을지 정할 수 있다.
      async authorize(credentials, request) {
        // credentials.status === 401 이면 없는 유저로 signup 페이지로 리다이렉트 시키기
        if (typeof credentials !== 'undefined') {
          const response = await axios.post('/api/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });
          /*
          {
            user: {
              id: 1,
              username: 'john.doe@mailinator.com',
              email: 'john.doe@mailinator.com',
              fullname: 'John Doe',
              ' role': 'SUPER',
              createdAt: '2021-05-30T06:45:19.000Z',
              name: 'John Doe',
            },
            token: 'ey...',
            // 또는
            token: {
              accessToken,
              refreshToken,
            }
          };
          */
          const { data, status } = response;
          if (typeof data !== 'undefined') {
            return { ...data.user, apiToken: data.token };
          } else if (status === 401) {
            // ...
          } else {
            return null;
          }
        } else {
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token, user }) {
      const sanitizedToken = Object.keys(token).reduce((p, c) => {
        // strip unnecessary properties
        if (c !== 'iat' && c !== 'exp' && c !== 'jti' && c !== 'apiToken') {
          return { ...p, [c]: token[c] };
        } else {
          return p;
        }
      }, {});
      return { ...session, user: sanitizedToken, apiToken: token.apiToken };
    },
    // jwt 콜백은 JWT 가 생성되거나 업데이트 되었을 때 실행
    // JWT 를 자동으로 쿠기에 저장
    async jwt({ token, user, account, profile }) {
      if (typeof user !== 'undefined') {
        // user has just signed in so the user object is populated
        return user as unknown as JWT;
      }
      return token;
    },
  },
  secret: process.env.JWT_SECRET || 'test',
  // https://next-auth.js.org/configuration/pages
  pages: {
    //signIn: '/auth/signin',
    /*
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    newUser: '/auth/new-user', // New users will be directed here on first sign in
    */
  },
};
