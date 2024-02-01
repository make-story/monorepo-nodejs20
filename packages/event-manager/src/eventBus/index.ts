/**
 * 서버 컴포넌트 또는 클라이언트 클라이언트 대응 가능한 이벤트 버스
 * https://developer.mozilla.org/ko/docs/Web/API/Event
 */
import { createEventDispatcher } from './proxy/index';

// 이벤트 Proxy
const {
  eventDispatcher,
  applyDispatcherInterceptor,
  ejectDispatcherInterceptor,
  clearDispatcherInterceptor,
} = createEventDispatcher();

export const eventBusOn = (
  type: string,
  listener: EventListener,
  options?: EventListenerOptions,
): void => {
  try {
    //document.addEventListener(type, listener, options);
    return eventDispatcher.addEventListener(type, listener, options);
  } catch {
    console.error('EventBus Error', 'eventBusOn');
  }
};

export const eventBusOff = (
  type: string,
  listener: EventListener,
  options?: EventListenerOptions,
): void => {
  try {
    //document.removeEventListener(type, listener, options);
    return eventDispatcher.removeEventListener(type, listener, options);
  } catch {
    console.error('EventBus Error', 'eventBusOff');
  }
};

export const eventBusDispatch = (type: string, payload: any = null) => {
  try {
    //return document.dispatchEvent(new CustomEvent(type, { detail: payload }));
    return eventDispatcher.dispatchEvent(
      new CustomEvent(type, { detail: payload }),
    );
  } catch (error) {
    console.error('EventBus Error', 'eventBusDispatch');
  }
};
