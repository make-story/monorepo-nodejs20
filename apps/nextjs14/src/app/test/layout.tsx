/**
 * 최상위 레이아웃(특정폴더/layout.tsx)을 루트 레이아웃 이라고 합니다.
 * 루트 레이아웃에는 html 및 body태그가 포함되어야 합니다.
 * 레이아웃은 기본적으로 서버 컴포넌트이지만 클라이언트 컴포넌트로 설정할 수 있습니다.
 * https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#layouts
 */

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <h1>Lauout</h1>
      {children}
    </>
  );
}
