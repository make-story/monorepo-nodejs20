/**
 * [example] 웹뷰 <-> 앱간 정보교환(인터페이스)
 * 이벤트버스(event-manager) 활용
 */
'use client';

import { useEffect } from 'react';
import {
  APP_EVENT_TYPE,
  appEventOn,
  appEventOff,
  webviewDispatch,
} from '@makestory/utils/index';

const Webview = () => {
  useEffect(() => {
    // 앱 -> 웹뷰
    const listener = ({ detail }: any = {}) => {
      console.log('App 에서 전송된 데이터!', detail);
    };
    appEventOff(APP_EVENT_TYPE.TEST, listener);
    appEventOn(APP_EVENT_TYPE.TEST, listener);
    // 웹뷰 -> 앱
    webviewDispatch('webkit')(APP_EVENT_TYPE.TEST, '테스트 데이터 전송!!!');
  }, []);

  return <>웹앱 인터페이스 TEST</>;
};

export default Webview;
