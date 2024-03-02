import {
  EventDispatcher,
  CustomEventType,
  EventDispatcherInterceptors,
} from '../types/index';

/**
 * 이벤트 감시가 가능한 Proxy 생성
 */
export const createEventDispatcher = (
  targetObject: EventDispatcher = typeof window === 'undefined'
    ? new EventTarget() // Node.js - https://nodejs.org/api/events.html#class-eventtarget
    : (document as EventDispatcher), // 클라이언트
) => {
  // 인터셉터
  // https://www.timegambit.com/blog/digging/axios/01
  // node_modules/axios/lib/core/InterceptorManager.js
  // node_modules/axios/lib/core/Axios.js
  const interceptors: EventDispatcherInterceptors = {
    on: {},
    off: {},
    dispatch: {},
  };
  const applyDispatcherInterceptor = (
    interceptor: keyof EventDispatcherInterceptors,
    type: string,
    handler: Function,
  ): number => {
    if (!Array.isArray(interceptors[interceptor][type])) {
      interceptors[interceptor][type] = [];
    }
    interceptors[interceptor][type].push(handler);
    return interceptors[interceptor][type].length - 1;
  };
  const ejectDispatcherInterceptor = (
    interceptor: keyof EventDispatcherInterceptors,
    type: string,
    index: number,
  ): Function | undefined => {
    if (Array.isArray(interceptors[interceptor][type])) {
      return interceptors[interceptor][type].splice(index, 1)[0];
    }
  };
  const clearDispatcherInterceptor = (
    interceptor: keyof EventDispatcherInterceptors,
    type: string,
  ): boolean | undefined => {
    if (Array.isArray(interceptors[interceptor][type])) {
      return delete interceptors[interceptor][type];
    }
  };
  const eventDispatcherInterceptor = (
    interceptor: keyof EventDispatcherInterceptors,
    type: string,
    ...payload: any
  ) => {
    return (
      !Array.isArray(interceptors[interceptor][type]) ||
      interceptors[interceptor][type].every(handler => {
        return handler(...[type, ...payload]);
      })
    );
  };

  // targetObject: CustomEvent를 감시할 대상 객체의 타입
  const eventDispatcher = new Proxy<EventDispatcher>(targetObject, {
    get: function (target, prop, receiver) {
      if (prop === 'addEventListener') {
        return function (
          type: string,
          listener: EventListener,
          options?: boolean | AddEventListenerOptions,
        ): void {
          //console.log(`addEventListener 호출: type - ${type}`);
          // 실제 addEventListener 호출
          eventDispatcherInterceptor('on', type, listener, options) &&
            target.addEventListener(type, listener, options);
        };
      } else if (prop === 'removeEventListener') {
        return function (
          type: string,
          listener: EventListener,
          options?: boolean | AddEventListenerOptions,
        ): void {
          //console.log(`removeEventListener 호출: type - ${type}`);
          // 실제 removeEventListener 호출
          eventDispatcherInterceptor('off', type, listener, options) &&
            target.removeEventListener(type, listener, options);
        };
      } else if (prop === 'dispatchEvent') {
        return function (event: CustomEventType): boolean | undefined {
          // 사용자가 실행한 이벤트인지 여부: event?.isTrusted
          //console.log(`dispatchEvent 호출: type - ${event.type}`);
          // 실제 dispatchEvent 호출
          if (eventDispatcherInterceptor('dispatch', event.type)) {
            return target.dispatchEvent(event);
          }
        };
      } else {
        return Reflect.get(target, prop, receiver);
      }
    },
  });

  return {
    eventDispatcher,
    applyDispatcherInterceptor,
    ejectDispatcherInterceptor,
    clearDispatcherInterceptor,
  };
};
