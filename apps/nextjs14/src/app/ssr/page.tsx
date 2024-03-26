/**
 * [example] 서버사이드 렌더링(SSR), 서버사이드 데이터 호출(ServerSide Fetch)
 * Next.js 13 이상 기본 서버사이드 컴포넌트
 *
 * 서버단에서 호출(Fetch)된 데이터 클라이언트에서 사용하능하도록 주입
 * 즉, 서버사이드에서 호출된 데이터를 클라이언트 렌더링시 전역스토어에 주입
 */
import TestContainer from '@/common/containers/test/TestContainer';

const fetchServerSideData = async (todoId: number = 1) => {
  'use server';
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`,
    { cache: 'no-store' },
  );
  return await response.json();
};

async function Page() {
  const todo = await fetchServerSideData(1);
  //console.log('todo', todo);

  return <TestContainer serverData={todo} />;
}

export default Page;
