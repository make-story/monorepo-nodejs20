import { MiddlewareArray } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  Persistor,
} from 'redux-persist';
import { createLogger } from 'redux-logger';
//import { injectFetchManagerMiddleware } from '@ysm/fetch-manager';
//import { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/dist/getDefaultMiddleware';

import { rtkQuery as commonRtkQuery } from '@/common/api/index';

export const middleware = (getDefaultMiddleware: any) => {
  // 미들웨어 기본 설정
  const middleware = getDefaultMiddleware({
    //thunk: false,
    // Immutability Middleware 활성화 여부
    // https://redux-toolkit.js.org/api/immutabilityMiddleware
    //
    // 주의! Redux state는 불변성을 유지해야 한다.
    // https://ko.redux.js.org/tutorials/fundamentals/part-1-overview/#the-redux-store
    immutableCheck: true,
    // Serializability Middleware 활성화 여부
    // https://redux-toolkit.js.org/api/serializabilityMiddleware
    //
    // 주의! Redux action 과 state는 직렬화 가능한 값만 포함해야 한다.
    // https://ko.redux.js.org/tutorials/essentials/part-4-using-data/#storing-dates-for-posts
    //serializableCheck: true,
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }).concat([
    ...commonRtkQuery.middleware,
    createLogger({
      duration: true,
      timestamp: false,
      collapsed: true,
      colors: {
        title: () => '#139BFE',
        prevState: () => '#1C5FAF',
        action: () => '#149945',
        nextState: () => '#A47104',
        error: () => '#ff0005',
      },
      predicate: () => typeof window !== 'undefined',
    }),
    //injectFetchManagerMiddleware,
  ]);

  // 환경에 따른 미들웨어 제어
  if (process.env.NODE_ENV !== 'production') {
    //middleware.push(logger)
  }

  return middleware;
};

export type TypedMiddleware = ReturnType<typeof middleware>;
