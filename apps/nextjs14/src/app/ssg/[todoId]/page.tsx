/**
 * [example] 동적 경로(동적 라우팅) SSG - generateStaticParams
 *
 * https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 *
 * https://mycodings.fly.dev/blog/2022-11-16-nextjs-13-how-to-ssg-isr-and-not-found
 */

type Props = {
  params: {
    todoId: string;
  };
};

interface TodoType {
  id: string;
  title: string;
  completed: boolean;
}

// SSR (서버사이드 Fetch Test - { cache: 'no-store' })
const fetchTodo = async (todoId: string) => {
  console.log('todoId', todoId);
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`,
    { cache: 'no-store' }, // 'no-store': SSR
  );
  const todo: TodoType = await res.json();
  return todo;
};

async function TodoId({ params: { todoId } }: Props) {
  const todo = await fetchTodo(todoId);

  return (
    <div className='space-y-2 border-4 border-blue-400 bg-slate-300 p-2'>
      <div>Todo Id : {todoId}</div>
      <div>Todo Title : {todo.title}</div>
      <div className='border-t border-black py-2'>
        Completed :{todo.completed ? <span> Yes</span> : <span> No</span>}
      </div>
    </div>
  );
}

// SSG 동적라우팅
// Next.js 13 : getStaticPaths -> generateStaticParams
export async function generateStaticParams() {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/`);
  const todos: TodoType[] = await res.json();
  console.log('todos', todos);

  // splice first 10
  const trimmedTodos = todos.splice(0, 10);

  // [ { todoId: '1'}, {todoId: '2'}, ...{todoId: '200'}]
  return trimmedTodos.map((todo: TodoType) => ({
    todoId: todo?.id?.toString(),
  }));
}

export default TodoId;
