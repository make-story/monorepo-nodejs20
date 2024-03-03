/**
 * /api/auth/*
 * https://medium.com/ascentic-technology/authentication-with-next-js-13-and-next-auth-9c69d55d6bfd
 *
 * 기본 설정으로 '/api/auth/signin' 접근시 로그인 페이지 출력
 *
 * [...nextauth] '...' 특수문자 입력 주의!
 * https://github.com/nextauthjs/next-auth/issues/7632#issuecomment-1559415021
 */
import NextAuth from 'next-auth';

import { authOptions } from '@/auth';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
