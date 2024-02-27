import { PropsWithChildren } from 'react';

const TestPage = function ({ children }: PropsWithChildren) {
  return (
    <>
      <div>{children}</div>
    </>
  );
};

export default TestPage;
