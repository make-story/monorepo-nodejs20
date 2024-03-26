/**
 * 리덕스 공식 페이지: Redux 저장소와 상호 작용(생성, 제공, 읽기 또는 쓰기)하는 모든 구성 요소는 클라이언트 구성 요소여야 합니다.
 * https://redux.js.org/usage/nextjs#providing-the-store
 *
 * https://github.com/vercel/next.js/blob/canary/examples/with-redux/lib/providers.tsx
 */
'use client';

import { useRef, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SessionProvider } from 'next-auth/react';
import { FetchProvider } from '@makestory/fetch-manager';

import { makeStore, AppStore } from '@/store';
//import { initializeCounter } from '@/example/store/counter';

export const Providers = ({
  children,
  session,
}: PropsWithChildren<{ session?: any }>) => {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    // [example]
    //storeRef.current.dispatch(initializeCounter({ value: count })); // 상위 구성 요소의 데이터로 저장소를 초기화해야 하는 경우
  }

  return (
    <>
      {/* next-auth */}
      <SessionProvider session={session}>
        {/* redux */}
        <Provider store={storeRef.current}>
          {/* redux-persist - https://github.com/vercel/next.js/issues/8240 */}
          <PersistGate persistor={storeRef.current.__persistor!} loading={null}>
            {() => (
              <>
                {/* fetch-manager */}
                <FetchProvider<AppStore> store={storeRef.current!}>
                  {children}
                </FetchProvider>
              </>
            )}
          </PersistGate>
        </Provider>
      </SessionProvider>
    </>
  );
};
