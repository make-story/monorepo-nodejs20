/**
 * [example]
 */
'use client';

import Card from '@/service/components/test/card/index';
import Counter from '@/service/components/test/counter/index';
import Webview from '@/service/components/test/webview/index';

function TestServiceContainer() {
  return (
    <>
      <Counter />
      <Card />
      <Webview />
    </>
  );
}

export default TestServiceContainer;