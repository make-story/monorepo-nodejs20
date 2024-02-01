/**
 * Next.js 미들웨어
 * 13 버전 기준으로 최상위 루트에 파일 위치해야 함 (app 또는 pages 또는 src 디렉토리와 동일한 위치)
 */
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest, event: NextFetchEvent) {
  //return NextResponse.redirect(new URL('/home', request.url));
  return NextResponse.next();
}

// 특정 path로만 해당 미들웨어가 동작하게 하고 싶다면 matcher를 사용할 수 있습니다.
export const config = {
  //matcher: ['/about/:path*', '/another/:path*'],
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
