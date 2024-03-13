import { PropsWithChildren } from 'react';

import TestCaseRun from '@/testManagement/components/case/TestCaseRun';

const TestCaseContainer = (props: PropsWithChildren) => {
  /**
   * 비즈니스 로직 및 이벤트 관리
   * 소켓 연결(nav 에서 선택된 값 전달)
   * 소켓에서 받은 내용 각 컴포넌트로 전달
   */
  // 웹소켓 사용자훅
  const useTestCaseWebSoket = () => {};
  return (
    <>
      <TestCaseRun />
    </>
  );
};

export default TestCaseContainer;
