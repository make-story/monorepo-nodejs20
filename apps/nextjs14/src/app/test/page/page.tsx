'use client';

import TestCommonContainer from '@/common/containers/test/TestCommonContainer';
import TestServiceContainer from '@/service/containers/test/TestServiceContainer';
import TestCaseContainer from '@/testManagement/containers/case/TestCaseContainer';

function Page() {
  return (
    <>
      <h2>TEST PAGE</h2>
      {/* <TestCommonContainer /> */}
      {/* <TestServiceContainer /> */}
      <TestCaseContainer />
    </>
  );
}

export default Page;
