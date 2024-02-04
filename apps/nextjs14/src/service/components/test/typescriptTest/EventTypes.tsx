/**
 * 이벤트 또는 DOM 등 타입
 */

import { ReactElement, MouseEvent, PropsWithChildren, UIEvent } from 'react';
import { throttle } from 'lodash';

export default function EventTypes({
  children,
}: PropsWithChildren): ReactElement {
  const onClickTest = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }
  };
  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    // ...
  };

  return (
    <>
      TEST
      <div onScroll={throttle(onScroll)}>
        <button onClick={onClickTest}>클릭!</button>
      </div>
    </>
  );
}
