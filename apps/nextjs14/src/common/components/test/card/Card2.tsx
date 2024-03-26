/**
 * [example] Context API 사용
 */
'use client';

import { useContextCard } from '@/common/store/card';

const Card2 = () => {
  const { user, setUser } = useContextCard();

  return (
    <>
      <h2>Card2 - Context API Test</h2>
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

export default Card2;
