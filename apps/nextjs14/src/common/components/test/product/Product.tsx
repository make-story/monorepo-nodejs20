/**
 * [example] Redux Toolkit + redux-persist 사용
 */
'use client';

import { useEffect, useState } from 'react';

import { useAppSelector, useAppDispatch } from '@/store';
import { setProductStatus, selectProductStatus } from '@/common/store/product';

const Product = () => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<string>('');
  const statusServer = useAppSelector(selectProductStatus);

  // [redux-persist] Redux State 를 읽어올 때 발생하는 Hydration 이슈 방지를 위해,
  // useEffect 로 클라이언트 시점에 상태값 주입
  // (redux-persist 는 클라이언트 브라우저 스토리지 기본 사용)
  useEffect(() => {
    setStatus(statusServer);
  }, [statusServer]);

  return (
    <>
      <h2>Redux Test (+ redux-persist)</h2>
      <div>
        status: <span>{!!status && status}</span>
      </div>
      <ul>
        <li>
          <button
            aria-label='Decrement value'
            onClick={() => dispatch(setProductStatus('idle'))}
          >
            idle
          </button>
        </li>
        <li>
          <button
            aria-label='Decrement value'
            onClick={() => dispatch(setProductStatus('loading'))}
          >
            loading
          </button>
        </li>
        <li>
          <button
            aria-label='Decrement value'
            onClick={() => dispatch(setProductStatus('failed'))}
          >
            failed
          </button>
        </li>
      </ul>
    </>
  );
};

export default Product;
