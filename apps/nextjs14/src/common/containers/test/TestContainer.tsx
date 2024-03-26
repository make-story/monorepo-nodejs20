/**
 * [example]
 */
'use client';

import { PropsWithChildren, useEffect } from 'react';

import { useAppDispatch } from '@/store';
import { CardProvider } from '@/common/store/card/index';
import { setServerData } from '@/common/store/product/index';
import Product from '@/common/components/test/product/Product';
import Card1 from '@/common/components/test/card/Card1';
import Card2 from '@/common/components/test/card/Card2';
import EventBus from '@/common/components/test/event/EventBus';
import DataList from '@/common/components/test/dataList/DataList';

export default function TestContainer({
  serverData,
}: PropsWithChildren<{ serverData?: any }>) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    serverData && dispatch(setServerData(serverData));
  }, [serverData]);

  return (
    <>
      <CardProvider>
        <EventBus />
        <DataList />
        <Product />
        <Card1 />
        <Card2 />
      </CardProvider>
    </>
  );
}
