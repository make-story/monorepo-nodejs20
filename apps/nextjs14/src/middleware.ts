/**
 * Next.js 미들웨어
 * https://nextjs.org/docs/app/building-your-application/routing/middleware
 */
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest, event: NextFetchEvent) {
  console.log('middleware', request.url);
  //return NextResponse.redirect(new URL('/home', request.url));
  return NextResponse.next();
}

// 특정 path로만 해당 미들웨어가 동작하게 하고 싶다면 matcher를 사용할 수 있습니다.
export const config = {
  //matcher: ['/about/:path*', '/another/:path*'],
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
