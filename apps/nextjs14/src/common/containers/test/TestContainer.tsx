/**
 * [example]
 */
'use client';
import { PropsWithChildren, useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { setServerData } from '@/common/store/product/index';
import Product from '@/common/components/test/product/Product';
import Auth from '@/common/components/test/auth/Auth';
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
      <EventBus />
      <DataList />
      <Product />
      <Auth />
    </>
  );
}
