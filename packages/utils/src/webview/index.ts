/**
 * 웹뷰 <-> 앱 정보(상태) 교환
 */
import {
  eventBusOn,
  eventBusOff,
  eventBusDispatch,
} from '@makestory/event-manager';

// 앱 <-> 웹뷰 연동 이벤트 타입
export const APP_EVENT_TYPE = {
  TEST: 'test',
};
export type TypedAppEvent =
  (typeof APP_EVENT_TYPE)[keyof typeof APP_EVENT_TYPE];

// 앱 -> 웹뷰 : 인터페이스 / 이벤트 on / 이벤트 off
// 앱쪽과 약속된 window.XXX 함수 추가
const appEventListener = (type: TypedAppEvent) => {
  try {
    if (
      type &&
      typeof window !== 'undefined' &&
      typeof (window as any)[type] !== 'function'
    ) {
      (window as any)[type] = (...payload: any) => {
        eventBusDispatch(type, payload);
      };
    }
  } catch (error) {
    console.log(error);
  }
};
if (typeof window !== 'undefined') {
  // 앱과 약속된 인터페이스 아래 추가
  appEventListener(APP_EVENT_TYPE.TEST);
  // ...
}
export { eventBusOn as appEventOn, eventBusOff as appEventOff };

// 웹뷰 -> 앱
// Android: window[bridge][type]
// IOS: window.webkit.messageHandlers 또는 bridge://type 스키마 방식
// 호출 예: webviewDispatch('webkit')(APP_EVENT_TYPE.TEST, 'message!!!!');
export type TypedBridge = string | 'webkit';
export const webviewDispatch =
  (bridge: TypedBridge) =>
  (
    type: TypedAppEvent, // 이벤트 타입
    ...payload: any // App 으로 전송할 값(이벤트 타입에 따라 필수값 아님)
  ) => {
    let result = null; // 안드로이드는 앱인터페이스 호출 후 리턴값 받을 수 있음
    if (!bridge || typeof window === 'undefined') {
      return result;
    }
    console.debug('webviewDispatch', bridge, payload);

    if (navigator.userAgent.indexOf('Android') !== -1) {
      // 안드로이드
      try {
        // @ts-ignore
        result = window?.[bridge]?.[type]?.(...payload);
      } catch (error: any) {
        console.error(error, `AOS window.${bridge} ${type}`);
      }
    } else if (
      navigator.userAgent.includes('Mac') &&
      'ontouchend' in document
    ) {
      // IOS
      try {
        if (bridge === 'webkit') {
          // WKWebView 방식
          // @ts-ignore
          window?.webkit?.messageHandlers?.[type].postMessage(
            JSON.stringify(payload),
          );
        } else {
          // 스키마 방식
          const iframe = document.createElement('iframe');
          const scheme = `${bridge}://${type}`;
          iframe.setAttribute('src', scheme);
          document.documentElement.appendChild(iframe);
          iframe.parentNode!.removeChild(iframe);
        }
      } catch (error: any) {
        console.error(error, `IOS window.${bridge}.messageHandlers ${type}`);
      }
    }

    return result;
  };

// 테스트
/*setTimeout(() => {
  // 앱에서 웹뷰 기능을 실행(콜)했다는 가정
  //window[APP_EVENT_TYPE.TEST]('TEST');
}, 3000);*/
