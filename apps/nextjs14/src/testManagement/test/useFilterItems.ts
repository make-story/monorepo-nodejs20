// useFilterItems.ts
import { useState } from 'react';

interface Item {
  id: number;
  name: string;
  category: string;
}

const useFilterItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value === 'all' ? null : e.target.value);
  };

  const fetchData = () => {
    // 여기에 실제 데이터를 가져오는 로직을 추가하면 됩니다.
    // 이 예시에서는 더미 데이터를 사용하겠습니다.
    const dummyData: Item[] = [
      { id: 1, name: 'Item A', category: 'Category A' },
      { id: 2, name: 'Item B', category: 'Category B' },
      { id: 3, name: 'Item C', category: 'Category A' },
    ];
    setItems(dummyData);
  };

  const filteredItems = categoryFilter
    ? items.filter(item => item.category === categoryFilter)
    : items;

  return { items: filteredItems, handleCategoryChange, fetchData };
};

export default useFilterItems;
