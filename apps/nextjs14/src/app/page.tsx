/**
 * 페이지는 기본적으로 서버 컴포넌트 이지만 클라이언트 컴포넌트로 설정할 수 있습니다.
 * https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages
 */
import TestPage from '@/common/components/templates/TestPage';

export default function Page() {
  return <TestPage>Test!!</TestPage>;
}
