/**
 * [example]
 */
'use client';

import Card from '#/src/example/components/test/card/index';
import Counter from '#/src/example/components/test/counter/index';
import Webview from '#/src/example/components/test/webview/index';

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
