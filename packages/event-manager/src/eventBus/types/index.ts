//export type EventListener = (event: Event) => void; // EventListener 기본 존재 (/node_modules/typescript/lib/lib.dom.d.ts)
export type EventOptions = boolean | AddEventListenerOptions | undefined;
/**
 * EventTarget
 * https://developer.mozilla.org/ko/docs/Web/API/EventTarget
 */
export interface EventDispatcher extends EventTarget {
  addEventListener(
    type: string,
    listener: EventListener,
    options?: EventOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListener,
    options?: EventOptions,
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
export interface EventDispatcherInterceptors {
  on: { [type: string]: Function[] };
  off: { [type: string]: Function[] };
  dispatch: { [type: string]: Function[] };
}
