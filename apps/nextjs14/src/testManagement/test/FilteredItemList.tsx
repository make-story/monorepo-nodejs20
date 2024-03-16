// FilteredItemList.tsx
import React from 'react';

interface Item {
  id: number;
  name: string;
  category: string;
}

interface FilteredItemListProps {
  items: Item[];
}

const FilteredItemList: React.FC<FilteredItemListProps> = ({ items }) => {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};

export default FilteredItemList;
