/**
 * 리덕스 공식 가이드 (pages 라우터 방식이 아닌, app 라우터 아키텍처 기준 가이드)
 * https://redux.js.org/usage/nextjs
 * https://redux-toolkit.js.org/api/configureStore
 */
import {
  configureStore,
  type ThunkAction,
  type Action,
  AnyAction,
  CombinedState,
  Reducer,
  MiddlewareArray,
} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'; // https://github.com/vercel/next.js/discussions/15687
import {
  useSelector as useReduxSelector,
  useDispatch as useReduxDispatch,
  useStore as useReduxStore,
  type TypedUseSelectorHook,
} from 'react-redux';

import { reducer, persistReducerList, TypedReducer } from './storeReducer';
import { middleware, TypedMiddleware } from './storeMiddleware';

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};
const persistedReducer = persistReducer(
  {
    key: 'root',
    version: 1,
    /*storage:
        // redux-persist Next.js 이상 대응을 위한 코드
        typeof window === 'undefined'
          ? createNoopStorage()
          : createWebStorage('local'),*/
    storage,
    whitelist: persistReducerList.whitelist, // reducer 중 스토리지에 저장할 것
    blacklist: persistReducerList.blacklist, // reducer 중 스토리지 저장에 제외할 것
  },
  reducer,
);
const makeConfiguredStore = (
  reducer: TypedReducer,
  middleware: TypedMiddleware,
) =>
  configureStore({
    devTools: process.env.NODE_ENV !== 'production',
    reducer,
    middleware,
  });
export const makeStore = () => {
  const store = makeConfiguredStore(persistedReducer, middleware);
  store.__persistor = persistStore(store);
  return store;
};

// Type 선언된 훅을 만들고 이를 사용하는 이유 : https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
export const useAppDispatch: () => AppDispatch = useReduxDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useAppStore: () => AppStore = useReduxStore;
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
