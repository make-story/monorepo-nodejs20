/**
 * https://medium.com/ascentic-technology/authentication-with-next-js-13-and-next-auth-9c69d55d6bfd
 */
'use client';

import { useState } from 'react';
import { getServerSession } from 'next-auth/next';
import { useSession } from 'next-auth/react';
import type { NextRequest } from 'next/server';

import { authOptions } from '@/auth';

/*export default async function Protected(req: NextRequest): Promise<any> {
  const session = await getServerSession(authOptions);

  return (
    <div className='grid grid-cols-2 text-white p-4'>
      <div>
        {session !== null ? (
          <h1 className='leading-loose text-[15rem] font-extrabold text-accent'>
            Hi {session?.user?.name}!
          </h1>
        ) : (
          <a className='btn btn-primary' href='/api/auth/signin'>
            Sign in
          </a>
        )}
      </div>
    </div>
  );
}*/

export default function ClientSideRoot(): any {
  const { data: session } = useSession();

  const [shown, setShown] = useState<boolean>(false);
  const clickHandler = (): void => {
    setShown(!shown);
  };

  return (
    <div className='grid grid-cols-2 text-white p-4'>
      <div>
        <h1 className='leading-loose text-[15rem] font-extrabold text-accent'>
          Hi {session?.user?.name}!
        </h1>
      </div>
      <div>
        <p>Protected client page</p>
        <button className='btn btn-primary' onClick={clickHandler}>
          Toggle
        </button>
        {shown ? <pre>{JSON.stringify(session, null, 2)}</pre> : null}
      </div>
    </div>
  );
}
