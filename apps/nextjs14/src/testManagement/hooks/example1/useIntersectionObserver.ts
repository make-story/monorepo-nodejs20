/**
 * 사용자 Hook 예시
 *
 * useEffect 를 사용하므로, onIntersect (콜백) 내 상태 의존성에 주의해야 한다!
 * (예를 들어, loading 값 또는 데이터 리스트 등)
 */
import { useEffect, RefObject } from 'react';

interface Props {
  root?: Element | null;
  ref: RefObject<Element>;
  onIntersect: IntersectionObserverCallback;
  rootMargin?: string;
  threshold?: number;
}

const useHook = ({
  root,
  ref,
  onIntersect,
  threshold = 1.0,
  rootMargin = '0px',
  ...props
}: Props) => {
  useEffect(() => {
    const target = ref?.current;
    console.log('useHook1 > target', target);
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(onIntersect, {
      root, // 기본값은 브라우저 뷰포트
      rootMargin,
      threshold,
    });
    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [root, ref?.current, rootMargin, onIntersect, threshold]);
};

export default useHook;
