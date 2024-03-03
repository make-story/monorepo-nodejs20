'use client';

import { lazy } from 'react';
import { PropsWithChildren } from 'react';

/*const SampleComponent = lazy(
  () =>
    window?.microfrontend?.get('./home').then((factory: any) => {
      return { default: factory() };
    }),
);*/

const TestPage = function ({ children }: PropsWithChildren) {
  return (
    <>
      <div>{children}</div>
    </>
  );
};

export default TestPage;
