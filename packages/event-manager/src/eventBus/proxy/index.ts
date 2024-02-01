import {
  EventDispatcher,
  CustomEventType,
  Interceptor,
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
  const interceptors: EventDispatcherInterceptors = {
    addEventListener: [],
    removeEventListener: [],
    dispatchEvent: [],
  };
  const applyDispatcherInterceptor = (interceptor: Interceptor): number => 0;
  const ejectDispatcherInterceptor = (interceptor: number) => null;
  const clearDispatcherInterceptor = () => null;

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
          target.removeEventListener(type, listener, options);
        };
      } else if (prop === 'dispatchEvent') {
        return function (event: CustomEventType): boolean {
          // 사용자가 실행한 이벤트인지 여부: event?.isTrusted
          //console.log(`dispatchEvent 호출: type - ${event.type}`);
          // 실제 dispatchEvent 호출
          return target.dispatchEvent(event);
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
