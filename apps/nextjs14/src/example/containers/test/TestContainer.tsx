/**
 * [example]
 */
'use client';

import Counter from '@/example/components/test/counter/index';
import Webview from '@/example/components/test/webview/index';
import Card from '@/example/components/test/card/index';

function TestContainer() {
  return (
    <>
      <Counter />
      <Card />
      <Webview />
    </>
  );
}

export default TestContainer;
