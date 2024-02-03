import {
  combineReducers,
  AnyAction,
  CombinedState,
  Reducer,
} from '@reduxjs/toolkit';
import { PersistPartial } from 'redux-persist/lib/persistReducer';

import service from '@/service/store/reducer';

/**
 * 각각의 reducer 를 하나로 합쳐준다.
 */
export const reducer = combineReducers({
  // ...
});

/**
 * persist 사용/미사용 리듀서 선언
 */
export const persistReducerList = {
  whitelist: [],
  blacklist: [],
};

export type TypedRootState = ReturnType<typeof reducer>;
export type TypedReducer = Reducer<
  CombinedState<TypedRootState> & PersistPartial,
  AnyAction
>;
