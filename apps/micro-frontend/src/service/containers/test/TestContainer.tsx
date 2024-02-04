/**
 * [example]
 */
'use client';

import { useEffect } from 'react';

import { importRemote } from '@/micro';

function TestContainer() {
  /*useEffect(() => {
    importRemote(
      '/_next/static/chunks/remoteEntry.js',
      'microfrontend',
      './home',
    ).then(result => console.log(result));
  }, []);*/

  return <>TEST</>;
}

export default TestContainer;
