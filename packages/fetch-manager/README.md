# API 데이터 호출 관리 (Axios)

- React 연동
- Redux (Redux-toolkit) 연동 코드 존재

> 특정버전 호환이 필요한 의존성 모듈은 package.json 에 peerDependencies 항목에도 의존성 패키지 및 버전 명시 필수!

`패키지를 사용하는 쪽에 현재 패키지가 의존하는 라이브러리 버전 설치 필수라는 것 명시!`  
`실제로 패키지에서 직접 require(import) 하지는 않더라도 호환성이 필요한 경우 명시!`

> `리액트팀은 이 fetch API를 확장해 같은 서버 컴포넌트 트리 내에서 동일한 요청이 있다면 재요청이 발생하지 않도록 요청 중복을 방지했다.`

즉, 서버 컴포넌트 내부 서버렌더링을 할 때, 데이터 통신은 fetch 를 통해서 해야 효율적!

## example

api

```tsx
import { FetchManager, API_TYPE, URL_PATH } from '@lotte/fetch-manager';

import { getPromiseData } from '@/common/utils/fetch';

/**
 * 테스트 데이터 호출
 * @param parmas - GET 파라미터
 * @param fetchManager - fetch-manager 인스턴스
 */
export const getTestDataList = (params: any, fetchManager: FetchManager) =>
  getPromiseData(
    fetchManager[API_TYPE.TEST]({
      url: URL_PATH.TEST.LIST,
      params,
    }),
  );
```

component 또는 사용자훅

```tsx
'use client';

import { useEffect } from 'react';
import { useFetchManager } from '@lotte/fetch-manager';

import { getTestDataList } from '@/common/api/test/fetch';
import { testApi, useGetTodosQuery } from '@/common/api/test/hook';

/**
 * 테스트 데이터 컴포넌트
 */
export default function DataList() {
  const fetchManager = useFetchManager(); // Fetch Manager 사용
  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetTodosQuery(); // RTK Query 사용

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
```
