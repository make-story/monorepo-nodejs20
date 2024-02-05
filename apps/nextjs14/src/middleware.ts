/**
 * Next.js 미들웨어
 * https://nextjs.org/docs/app/building-your-application/routing/middleware
 *
 * 미들웨어 안정화 버전
 * 12.2.0버전에서 안정화 되었고 13.0.0 버전에서 요청/응답 헤더와 응답을 변경할 수 있게 추가
 *
 * 참고자료
 * https://velog.io/@pds0309/nextjs-%EB%AF%B8%EB%93%A4%EC%9B%A8%EC%96%B4%EB%9E%80
 */
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest, event: NextFetchEvent) {
  console.log('middleware', request.url);
  //return NextResponse.redirect(new URL('/home', request.url));
  //return NextResponse.next();

  let cookie = request.cookies.get('nextjs');
  const allCookies = request.cookies.getAll();
  //console.log('Next.js middleware', cookie);
  //console.log('Next.js middleware', allCookies);

  request.cookies.has('nextjs');
  request.cookies.delete('nextjs');
  request.cookies.has('nextjs');

  // Setting cookies on the response using the `ResponseCookies` API
  const response = NextResponse.next();
  response.cookies.set('vercel', 'fast');
  response.cookies.set({
    name: 'vercel',
    value: 'fast',
    path: '/',
  });
  cookie = response.cookies.get('vercel');
  console.log('Next.js middleware', cookie); // => { name: 'vercel', value: 'fast', Path: '/' }

  return response;
}

// 특정 path로만 해당 미들웨어가 동작하게 하고 싶다면 matcher를 사용할 수 있습니다.
export const config = {
  //matcher: ['/about/:path*', '/another/:path*'],
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
