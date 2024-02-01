/**
 * [example]
 */
'use client';

import Product from '@/common/components/test/product/Product';
import Auth from '@/common/components/test/auth/Auth';
import EventBus from '@/common/components/test/event/EventBus';
import DataList from '@/common/components/test/dataList/DataList';

export default function TestContainer() {
  return (
    <>
      <EventBus />
      <DataList />
      <Product />
      <Auth />
    </>
  );
}
