/**
 * 리액트 컴포넌트 내부에서 사용하는 방법
 */
'use client'; // Next.js 서버 컴포넌트 대응

import { useContext } from 'react';
//import { ReactReduxContext } from 'react-redux';

import { FetchContext } from '../context/index';

export function useFetchManager() {
  const { fetchManager } = useContext(FetchContext);

  // Context 방식이 아닌, 아래 방식으로 할 경우, React 재렌더링 될 때 마다, 인스턴스 재생성됨 (비효율)
  //const store = useStore(); // import { useStore } from 'react-redux';
  //const { store } = useContext(ReactReduxContext); // HACK: https://react-redux.js.org/using-react-redux/accessing-store#using-reactreduxcontext-directly
  /*const instance = useMemo(() => {
    logger.debug('useFetchManager', store);
    return {
      ...createFetchManager({ store }),
    };
  }, [store]);*/

  if (!fetchManager) {
    throw Error('Fetch Provider 가 필요합니다.');
  }

  return fetchManager;
}
