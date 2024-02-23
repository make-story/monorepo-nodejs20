import { useState } from 'react';

const useArrayState = (initialState = []): any => {
  const [state, setState] = useState<any[]>(initialState);

  const add = (newValue: any) => {
    setState(currentState => [...currentState, newValue]);
  };
  const remove = (index: number) => {
    setState(currentState => {
      const newState = [...currentState];
      newState.splice(index, 1);
      return newState;
    });
  };

  return [state, { add, remove }];
};

export default useArrayState;
