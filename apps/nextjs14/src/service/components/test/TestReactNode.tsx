import {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  UIEvent,
  useCallback,
  useMemo,
  useState,
  isValidElement,
  cloneElement,
} from 'react';

interface Props extends PropsWithChildren {
  bar: ReactNode;
}

export default function TestReactNode({ bar }: Props): ReactElement {
  const Navigation = useMemo((): ReactNode => {
    if (isValidElement(bar)) {
      const props = { title: 'test!!!' };
      return cloneElement(bar, props);
    }
    return bar;
  }, [bar]);

  return <>{Navigation && <>{Navigation}</>}TEST</>;
}
