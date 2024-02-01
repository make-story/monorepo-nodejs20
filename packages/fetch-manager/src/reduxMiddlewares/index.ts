import { Middleware } from '@reduxjs/toolkit';

import { createFetchManager, FetchManager } from '../index';

/**
 * 리덕스 사가
 * Redux Action Payload 로 Axios Instance 를 추가하는 미들웨어
 */
export const injectFetchManagerMiddleware: Middleware = (store: any) => {
  //console.log('injectAxiosMiddleware', Date.now());

  // Axios Interceptor에 스토어 주입
  // store.getState() 실행시점의 스토어 상태를 가져온다.
  // redux 미들웨어는 스토어가 생성됨과 동시에 주입되므로, store.getState() 스토어 상태는 초기화된 상태이다. (스토어에는 아무 상태값도 없음)
  const fetchManager: FetchManager = createFetchManager({ store });
  // 스토어 변경사항 구독 불가능 - 미들웨어 시점에 store.subscribe 값을 가지고 있지 않음
  /*store.subscribe(() => {
    // ...
  });*/

  return next => {
    return action => {
      console.log('injectFetchManagerMiddleware > action', action);

      // 각 액션 실행 시
      /*const state = store?.getState() || {}; // 현 시점의 스토어 상태값 가져오기

      // interceptor 로 추가할 경우, Interceptor 콜백 수가 action 실행수만큼 증가한다.
      Object.values(fetchManager).forEach((instance: AxiosInstance) =>
        applyAxiosConfig(instance, getAxiosConfig(API_TYPE.TEST, { state })),
      );*/
      next({ ...action, fetchManager });
    };
  };
};

export default injectFetchManagerMiddleware;
