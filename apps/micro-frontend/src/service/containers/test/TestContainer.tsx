/**
 * [example]
 */
'use client';

import { importRemote } from '@/micro';
import { useEffect } from 'react';

function TestContainer() {
  useEffect(() => {
    importRemote(
      '/_next/static/chunks/remoteEntry.js',
      'microfrontend',
      './home',
    ).then(result => console.log(result));
  }, []);

  return <>TEST</>;
}

export default TestContainer;
