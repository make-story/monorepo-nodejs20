/**
 * [example] 서버사이드 렌더링 (SSR)
 */
const fetchTodo = async (todoId: string = '1') => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId}`,
    { cache: 'force-cache' },
  );
  const todo: any = await res.json();
  return todo;
};

async function TodoId() {
  const todoId = '1';
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

export default TodoId;
