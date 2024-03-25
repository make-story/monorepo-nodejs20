import {
  combineReducers,
  AnyAction,
  CombinedState,
  Reducer,
} from '@reduxjs/toolkit';
import { PersistPartial } from 'redux-persist/lib/persistReducer';

import example from '#/src/example/store/reducer';

import common from '@/common/store/reducer';
import { rtkQuery as commonRtkQuery } from '@/common/api/index';

/**
 * 각각의 reducer 를 하나로 합쳐준다.
 */
export const reducer = combineReducers({
  // Redux
  common,
  example,
  // RTK Query
  ...commonRtkQuery.reducer,
});

/**
 * persist 사용/미사용 리듀서 선언
 */
export const persistReducerList = {
  whitelist: ['common'],
  blacklist: [],
};

export type TypedRootState = ReturnType<typeof reducer>;
export type TypedReducer = Reducer<
  CombinedState<TypedRootState> & PersistPartial,
  AnyAction
>;
