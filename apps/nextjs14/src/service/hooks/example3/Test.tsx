import useArrayState from './useArrayState';

const TestHook = () => {
  const [todos, { add, remove }] = useArrayState([]);

  const addTodo = () => {
    add({ name: 'test' });
  };
  const removeTodo = (index: number) => {
    remove(index);
  };

  return (
    <>
      <ul>{/* todo list */}</ul>
    </>
  );
};

export default TestHook;
