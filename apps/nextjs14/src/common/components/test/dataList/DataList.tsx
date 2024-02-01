/**
 * [example] fetch-manager 사용, RTK Query 사용
 */
'use client';

import { useEffect } from 'react';
import { useFetchManager } from '@ysm/fetch-manager';

import { getTestDataList } from '@/common/api/test/fetch';
import { testApi, useGetTodosQuery } from '@/common/api/test/hook';

export default function DataList() {
  const fetchManager = useFetchManager();
  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetTodosQuery();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTestDataList({}, fetchManager);
      console.debug('DataList > useEffect > data', data);
    };
    fetchData();
  }, []);

  return (
    <>
      <h2>Data Fetch Test (+ RTK Query)</h2>
      {isLoading && <div>로딩중!</div>}
      {isFetching && <div>데이터호출 진행중!</div>}
      {isSuccess && <div>데이터호출 완료!</div>}
      <div>{JSON.stringify(data)}</div>
    </>
  );
}
