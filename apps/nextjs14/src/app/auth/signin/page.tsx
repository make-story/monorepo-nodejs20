/**
 * 페이지는 기본적으로 서버 컴포넌트 이지만 클라이언트 컴포넌트로 설정할 수 있습니다.
 * https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages
 */
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProviders, signIn, ClientSafeProvider } from 'next-auth/react';

import BaseLayout from '@/common/components/layouts/BaseLayout';

export default function Page() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '';
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    (async () => {
      setProviders(await getProviders());
    })();
  }, []);

  console.log('providers', providers);

  return (
    <BaseLayout>
      <BaseLayout.Header>Header</BaseLayout.Header>
      <BaseLayout.Container>
        Login Page!!!
        {providers &&
          Object.values(providers)?.map((provider: any) => (
            <div key={provider?.name} className='m-4 bg-slate-200'>
              <button onClick={() => signIn(provider.id, { callbackUrl })}>
                Sign in with {provider.name}
              </button>
            </div>
          ))}
      </BaseLayout.Container>
      <BaseLayout.Footer>Footer</BaseLayout.Footer>
    </BaseLayout>
  );
}
