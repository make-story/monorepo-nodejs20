export type EventListener = (event: Event) => void;

/**
 * EventTarget
 * https://developer.mozilla.org/ko/docs/Web/API/EventTarget
 */
export interface EventDispatcher extends EventTarget {
  addEventListener(
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions,
  ): void;
  dispatchEvent(event: Event): boolean;
}

/**
 * CustomEvent / Event
 * https://developer.mozilla.org/ko/docs/Web/API/CustomEvent
 * https://developer.mozilla.org/ko/docs/Web/API/Event
 */
export interface CustomEventType<T = any> extends Event {
  // CustomEvent 와 Event 대응
  detail: T;
}

/**
 * Proxy 동작간 인터셉터
 */
export interface Interceptor {
  type: string;
  interceptor: (...payload: any) => boolean;
}
export interface EventDispatcherInterceptors {
  addEventListener?: Interceptor[];
  removeEventListener?: Interceptor[];
  dispatchEvent?: Interceptor[];
}
