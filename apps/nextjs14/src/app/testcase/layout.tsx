/**
 * 중첩 레이아웃(특정폴더/layout.tsx)
 * 특정 경로 내부에 추가(layout.tsx)하여 레이아웃을 중첩할 수 있음
 * https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#nesting-layouts
 */

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <p>테스트 페이지</p>
      {children}
    </>
  );
}
