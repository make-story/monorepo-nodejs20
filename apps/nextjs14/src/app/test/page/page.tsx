'use client';

import TestContainerCommon from '@/common/containers/test/TestContainer';
import TestContainerService from '@/service/containers/test/TestContainer';

function Page() {
  return (
    <>
      TEST PAGE
      <TestContainerCommon />
      <TestContainerService />
    </>
  );
}

export default Page;
