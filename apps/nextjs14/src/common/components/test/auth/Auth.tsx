/**
 * [example] Context API 사용
 */
'use client';

import { useEffect, useState } from 'react';

import { useContextAuth } from '@/common/store/auth';
import TestContainer from '@/common/containers/test/TestContainer';

const Auth = () => {
  const { user, setUser } = useContextAuth();

  return (
    <>
      <h2>Context API Test</h2>
      <div>
        <span>{!!user && `${user.id} / ${user.username}`}</span>
      </div>
      <ul>
        <li>
          <input
            name='id'
            placeholder='id'
            onChange={event =>
              setUser({
                username: user?.username || '',
                id: Number(event?.currentTarget.value),
              })
            }
          />
        </li>
        <li>
          <input
            name='username'
            placeholder='username'
            onChange={event =>
              setUser({
                id: user?.id || 0,
                username: event?.currentTarget.value,
              })
            }
          />
        </li>
      </ul>
    </>
  );
};

export default Auth;
