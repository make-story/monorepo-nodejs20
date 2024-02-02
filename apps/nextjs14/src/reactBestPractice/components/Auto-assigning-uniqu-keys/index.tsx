// list 에서 key 주입 안하는 방법

/*const App = ({ list }: { list: any[] }) => {
  return list.map((item: any) => {
    return <div key={item.id}>{item.name}</div>;
  });
};*/

import { Children } from 'react';

const App = ({ list }: { list: any[] }) => {
  return Children.toArray(list.map((item: any) => <li>{item.name}</li>));
};
