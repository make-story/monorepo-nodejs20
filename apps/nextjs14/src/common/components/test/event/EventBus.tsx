/**
 * [example] event-manager 사용, eventBus
 */
'use client';

import { useEffect, ComponentProps, useCallback } from 'react';
import {
  eventBusOn,
  eventBusOff,
  eventBusDispatch,
  eventBusApplyInterceptor,
  eventBusEjectInterceptor,
  eventBusClearInterceptor,
} from '@makestory/event-manager';

import { EVENT_BUS } from '@/common/constant/event';

export default function EventBus() {
  const listener = useCallback(({ detail }: any = {}) => {
    console.log('EventBus Test!!!', detail);
  }, []);

  useEffect(() => {
    // 이벤트 인터셉터 설정
    console.log(
      '이벤트 인터셉터 설정!',
      'on',
      eventBusApplyInterceptor('on', EVENT_BUS.TEST, (type: any) => {
        console.log('eventBusApplyInterceptor!!', 'on', type);
        return true;
      }),
    );
    console.log(
      '이벤트 인터셉터 설정!',
      'dispatch',
      eventBusApplyInterceptor('dispatch', EVENT_BUS.TEST, (type: any) => {
        console.log('eventBusApplyInterceptor!!', 'dispatch', type);
        return true;
      }),
    );
    // 이벤트 설정
    eventBusOff(EVENT_BUS.TEST, listener);
    eventBusOn(EVENT_BUS.TEST, listener);
  }, [listener]);

  const onClick: ComponentProps<'button'>['onClick'] = event => {
    eventBusDispatch(EVENT_BUS.TEST, { data: 'TEST' });
  };

  return (
    <>
      <h2>EvnetBus Test</h2>
      <div>
        <button onClick={onClick}>onClick</button>
      </div>
    </>
  );
}
