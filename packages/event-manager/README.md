# event 관련 헬퍼 (helper)

## event bus

- App 간의 데이터 교환에 활용
- 마이프로프론트간 데이터 교환에 활용

## example

```tsx
'use client';

import { useEffect, ComponentProps, useCallback } from 'react';
import {
  eventBusOn,
  eventBusOff,
  eventBusDispatch,
} from '@lotte/event-manager';

import { EVENT_BUS } from '@/common/constant/event';

export default function EventBus() {
  const eventTest = useCallback(({ detail }: any = {}) => {
    console.log('EventBus', '!!!!!!!!!', detail);
  }, []);

  useEffect(() => {
    eventBusOff(EVENT_BUS.TEST, eventTest);
    eventBusOn(EVENT_BUS.TEST, eventTest);
  }, [eventTest]);

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
```
