import { Children, useState } from 'react';

function UserForm() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const onItemClick = (item: any) => () => setSelectedItem(item);

  return (
    <ul>
      {items.map((item: any) => {
        return Children.toArray(<li onClick={onItemClick(item)}></li>);
      })}
    </ul>
  );
}
