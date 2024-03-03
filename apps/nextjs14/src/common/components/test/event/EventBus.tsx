/**
 * [example] event-manager 사용, eventBus
 */
'use client';

import { useEffect, ComponentProps, useCallback } from 'react';
import {
  eventBusOn,
  eventBusOff,
  eventBusDispatch,
} from '@makestory/event-manager';

import { EVENT_BUS } from '@/common/constant/event';

export default function EventBus() {
  const listener = useCallback(({ detail }: any = {}) => {
    console.log('EventBus Test!!!', detail);
  }, []);

  useEffect(() => {
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
