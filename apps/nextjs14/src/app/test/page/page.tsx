'use client';

import TestContainerCommon from '@/common/containers/test/TestContainer';
import TestContainerService from '@/service/containers/test/TestContainer';
import TestCaseContainer from '@/testManagement/containers/case/TestCaseContainer';

function Page() {
  return (
    <>
      TEST PAGE
      <TestCaseContainer />
    </>
  );
}

export default Page;
