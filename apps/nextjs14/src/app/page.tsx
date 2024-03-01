/**
 * 페이지는 기본적으로 서버 컴포넌트 이지만 클라이언트 컴포넌트로 설정할 수 있습니다.
 * https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages
 */
'use client';

import BaseLayout from '@/common/components/layouts/BaseLayout';
import TestPage from '@/common/components/templates/TestPage';

export default function Page() {
  return (
    <BaseLayout>
      <BaseLayout.Header>Header</BaseLayout.Header>
      <BaseLayout.Container>
        <TestPage>Test!!</TestPage>
      </BaseLayout.Container>
      <BaseLayout.Footer>Footer</BaseLayout.Footer>
    </BaseLayout>
  );
}
