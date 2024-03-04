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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/common/components/test/shadcn/Accordion/index';

export default function TestCommonContainer({
  serverData,
}: PropsWithChildren<{ serverData?: any }>) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    serverData && dispatch(setServerData(serverData));
  }, [serverData]);

  return (
    <>
      <Accordion type='single' collapsible>
        <AccordionItem value='item-1'>
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <EventBus />
      <DataList />
      <Product />
      <Auth />
    </>
  );
}
