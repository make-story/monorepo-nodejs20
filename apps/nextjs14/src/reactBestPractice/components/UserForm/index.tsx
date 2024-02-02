import { useReducer, useState, ReducerWithoutAction } from 'react';

/*function UserForm() {
  const [user, serUser] = useState({
    name: '',
    age: '',
  });

  const onInputChange = (event: any) => {
    const {
      target: { value, name },
    } = event;

    serUser(prevState => ({ ...prevState, [name]: value }));
  };

  // Form
  // ...
}*/

const reducer = (state: any, action: any) => ({ ...state, ...action });

function UserForm() {
  const [user, serField] = useReducer(reducer, {});

  const onInputChange = (event: any) => {
    const {
      target: { value, name },
    } = event;

    serField({ [name]: value });
  };

  // Form
  // ...
}
