'use client';

import {
  PropsWithChildren,
  ReactNode,
  createContext,
  useContext,
  useState,
} from 'react';

// BaseLayout 하위 컴포넌트 상태 교환을 위한 Context
interface IBaseLayoutContextValue {
  count?: number; // test 용
}
const BaseLayoutContext = createContext<IBaseLayoutContextValue | undefined>(
  {},
);

// BaseLayout 최상위 컴포넌트 - 단순히 children 을 BaseLayoutContext.Provider 로 래핑
const BaseLayout = function ({ children }: { children?: ReactNode }) {
  return (
    <BaseLayoutContext.Provider value={{}}>
      <main>{children}</main>
    </BaseLayoutContext.Provider>
  );
};

// BaseLayout.Header
export const Header: React.FC<PropsWithChildren> = function ({
  children,
}: {
  children?: ReactNode;
}) {
  // BaseLayoutContext 를 사용하여 BaseLayout 관련 로직을 공유
  const baseLayoutContext = useContext(BaseLayoutContext);
  const isCompounded = baseLayoutContext !== undefined;

  return <header>{children}</header>;
};
//BaseLayout.Header = Header;

// BaseLayout.Container
export const Container: React.FC<PropsWithChildren> = function ({
  children,
}: {
  children?: ReactNode;
}) {
  // BaseLayoutContext 를 사용하여 BaseLayout 관련 로직을 공유
  const baseLayoutContext = useContext(BaseLayoutContext);
  const isCompounded = baseLayoutContext !== undefined;

  return <div>{children}</div>;
};
//BaseLayout.Container = Container;

// BaseLayout.Footer
export const Footer: React.FC<PropsWithChildren> = function ({
  children,
}: {
  children?: ReactNode;
}) {
  // BaseLayoutContext 를 사용하여 BaseLayout 관련 로직을 공유
  const baseLayoutContext = useContext(BaseLayoutContext);
  const isCompounded = baseLayoutContext !== undefined;

  return <footer>{children}</footer>;
};
//BaseLayout.Footer = Footer;

const BaseLayoutRoot = Object.assign(BaseLayout, {
  Header,
  Container,
  Footer,
});

export default BaseLayoutRoot;
