import {
  ComponentType,
  ComponentProps,
  useEffect,
  useRef,
  ReactPropTypes,
} from 'react';
import { NextComponentType } from 'next';

import useHook1 from '@/service/hooks/example1/useHook';
import useHook2 from '@/service/hooks/example2/useScrollPersist';

/**
 * Test HOC
 *
 * 특정 컴포넌트에 대해, 공통기능(조건)이 적동될 수 있도록 해주는 HOC
 * 만약, 시간이 지남에 따라, 공통된 특정 조건에서 일부만 적용해야 하는 컴포넌트가 발생할 경우, 아래 코드 중 특정 Hook 만 해당 컴포넌트에 적용하는 것으로 유연함 제공
 */
function withHoc1<P extends {} = any>(WrappedComponent: ComponentType<P>) {
  const Component = (props: ComponentProps<typeof WrappedComponent>) => {
    const ref = useRef<HTMLDivElement>(null);

    useHook1({
      ref,
      onIntersect: () => {
        console.log('onIntersect');
      },
    });
    useHook2({ domHeight: 100 });

    return (
      <div ref={ref}>
        <WrappedComponent {...props} />
      </div>
    );
  };

  Component.displayName = `withHoc1(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return Component;
}

export default withHoc1;
