/**
 * 루트 레이아웃(app/layout.tsx)은 기본적으로 서버 컴포넌트이며 클라이언트 컴포넌트로 설정할 수 없습니다.
 * (기존 Next.js pages 라우트 방식에서 루트 레이아웃은 _app.js 및 _document.js파일을 대체)
 * https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
 */
//import { Inter } from 'next/font/google'; // 방화벽 등으로 접근이 안될 수 있음
import type { Metadata, Viewport } from 'next';
import { PropsWithChildren, ReactNode } from 'react';
import { cookies } from 'next/headers';

import './globals.css';
import { Providers } from '@/providers';

//const inter = Inter({ subsets: ['latin'] });

// meta tag
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

// viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const session = cookieStore.get('session');

  return (
    <html lang='ko'>
      {/* body 에 다크모드가 적용되어 있을 경우, 서버 렌더링의 경우 다크모드 결과 값을 알 수 없고, 클라이언트 렌더링에서 다크모드 값이 적용되기 때문에, 서버렌더링과 클리아언트 렌더링 결과가 다르기 때문에 경고가 발생! */}
      {/* 이를 해결하고자 suppressHydrationWarning 속성값 설정 */}
      <body suppressHydrationWarning={true}>
        <div>
          <strong>Root Lauout</strong>
        </div>
        {/* Provider */}
        {/* https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#using-context-providers */}
        <Providers>{children}</Providers>
        <script src='//localhost:3000/_next/static/chunks/remoteEntry.js' />
      </body>
    </html>
  );
}
