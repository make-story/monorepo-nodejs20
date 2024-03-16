/**
 * unmount된 컴포넌트의 상태 업데이트를 막는 훅
 * https://itchallenger.tistory.com/258
 */
import {
  useRef,
  useEffect,
  useCallback,
  SetStateAction,
  DispatchWithoutAction,
} from 'react';
import { Dispatch } from 'redux';
import { PayloadAction } from '@reduxjs/toolkit';

export function useSafeDispatch(dispatch: Dispatch<PayloadAction<any>>) {
  const mountedRef = useRef<boolean>(false);

  // to make this even more generic you should use the useLayoutEffect hook to
  // make sure that you are correctly setting the mountedRef.current immediately
  // after React updates the DOM. Even though this effect does not interact
  // with the dom another side effect inside a useLayoutEffect which does
  // interact with the dom may depend on the value being set
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useCallback(
    ({ type, payload }: PayloadAction) =>
      mountedRef.current ? dispatch({ type, payload }) : void 0,
    [dispatch],
  );
}
