/**
 * React Context
 */
import { createContext, PropsWithChildren } from 'react';

import { createFetchManager } from '../index';
import { FetchProviderProps } from '../types/index';

export const FetchContext = createContext<{
  fetchManager?: ReturnType<typeof createFetchManager>;
}>({});

export function FetchProvider<S>({
  store,
  children,
}: PropsWithChildren<FetchProviderProps<S>>) {
  // Next.js 13 이상, app route (기본 서버 컴포넌트 방식) 사용할 경우, useMemo 는 서버에서 작동하지 않는다.
  /*
  const isServer = typeof window === 'undefined';
  const instance = useMemo(
    () => ({
      fetchManager: createFetchManager({ store }),
    }),
    [store],
  );
  */
  const instance = {
    fetchManager: createFetchManager({ store }),
  };

  return (
    <FetchContext.Provider value={instance}>{children}</FetchContext.Provider>
  );
}
