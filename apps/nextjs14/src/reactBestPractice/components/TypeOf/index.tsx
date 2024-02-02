import { useState } from 'react';

export default function TypeOf() {
  const [state, setState] = useState({
    name: 'YSM',
    age: 25,
  });

  const changePerson = (obj: typeof state) => {
    setState(obj);
  };

  return (
    <button onClick={() => changePerson({ name: 'Camille', age: 32 })}>
      Change Person
    </button>
  );
}
