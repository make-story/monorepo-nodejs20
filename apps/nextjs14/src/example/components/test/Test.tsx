import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import withHoc1 from '@/example/hocs/example/withHoc';

const testData = [
  {
    src: '',
  },
];

const StyledWrap = styled.div`
  background-color: hotpink;
  div {
    font-size: 24px;
  }
`;

/**
 * 요소가 뷰포트 안에 있는지 여부
 * IntersectionObserver 활용
 */
const useIsElementInViewport = (options?: IntersectionObserverInit) => {
  const elementRef = useRef<HTMLImageElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const callback = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callback, options);
    elementRef?.current && observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [elementRef, options]);

  return { elementRef, isVisible };
};

/**
 * 이미지 로드 여부
 */
const useIsImgLoaded = (lazy: boolean) => {
  const { elementRef, isVisible } = useIsElementInViewport({
    rootMargin: '0px 0px 100px 0px', // 하단 100px 기준
  });
  const [isLoaded, setIsLoaded] = useState(!lazy);

  useEffect(() => {
    if (isLoaded || !isVisible) {
      return;
    }
    setIsLoaded(true); // 이미지 노출!
  }, [isVisible]);

  return { elementRef, isLoaded };
};

/**
 * 이미지 컴포넌트
 */
const Img = (props: any) => {
  const { src, lazy = true, index = 0 } = props;
  const { elementRef, isLoaded } = useIsImgLoaded(lazy);

  return <img ref={elementRef} src={isLoaded ? src : ''} key={index} />;
};

const Test = ({ images = testData }) => {
  return (
    <>
      {images.map((image, index) => Img({ ...image, index }))}
      <StyledWrap>Test</StyledWrap>
    </>
  );
};

export default withHoc1(Test);
