/**
 * [example] Redux Toolkit 사용, logging-manager 사용
 */
'use client';

import { useEffect, useState } from 'react';
import { LOG_LEVEL, LOG_GROUP_KEY, logger } from '@makestory/logging-manager';

import {
  decrement,
  increment,
  incrementByAmount,
  selectCount,
} from '#/src/example/store/counter';

import { useAppSelector, useAppDispatch } from '@/store';

const Counter = () => {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const [incrementAmount, setIncrementAmount] = useState(2);

  useEffect(() => {
    logger(LOG_LEVEL.ERROR, console.debug, 'test1', 'test-1');
    logger(LOG_LEVEL.WARN)(console.log)('test2', 'test-2');
    logger(console.warn)('test3', 'test-3');
    logger('test4', 'test-4');
    logger.error('test5', 'test-5');
    logger.warn('test6', 'test-6');
    logger.info('test7', 'test-7');
    logger.debug('test8', 'test-8');
    logger({ level: LOG_LEVEL.WARN, [LOG_GROUP_KEY]: LOG_LEVEL.WARN })(
      `로그 그룹을 "${LOG_LEVEL.WARN}" 라는 값으로 설정!`,
    );
    logger({ level: LOG_LEVEL.ERROR, [LOG_GROUP_KEY]: 'test' })(
      '로그 그룹을 "test" 라는 값으로 설정!',
    );
    const log = logger(LOG_LEVEL.WARN)(console.log);
    log('1');
    log('2', '3');
  }, []);

  return (
    <>
      <h2>Redux Test</h2>
      <div>
        <span>{count}</span>
      </div>
      <ul>
        <li>
          <button
            aria-label='Decrement value'
            onClick={() => dispatch(decrement())}
          >
            -
          </button>
        </li>
        <li>
          <button
            aria-label='Increment value'
            onClick={() => dispatch(increment())}
          >
            +
          </button>
        </li>
        <li>
          <input
            aria-label='Set increment amount'
            value={incrementAmount}
            onChange={e => setIncrementAmount(Number(e.target.value ?? 0))}
          />
          <button onClick={() => dispatch(incrementByAmount(incrementAmount))}>
            Add Amount
          </button>
        </li>
      </ul>
    </>
  );
};

export default Counter;
