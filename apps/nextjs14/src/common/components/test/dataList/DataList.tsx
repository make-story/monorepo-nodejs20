/**
 * [example] fetch-manager 사용, RTK Query 사용
 */
'use client';

import { useEffect } from 'react';
import { useFetchManager } from '@makestory/fetch-manager';

import { useAppDispatch } from '@/store';
import { getTestDataList } from '@/common/api/test/fetch';
import { testApi, useGetTodosQuery } from '@/common/api/test/hook';

export default function DataList() {
  const dispatch = useAppDispatch();
  const fetchManager = useFetchManager();
  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetTodosQuery();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTestDataList({}, fetchManager); // fetchManager 또는 axios 등 fetch 인스턴스 주입가능
      console.debug('DataList > useEffect > data', data);
      // 전역 상태에 데이터 일부 주입
      // ...
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
