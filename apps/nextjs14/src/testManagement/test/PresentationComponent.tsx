// PresentationComponent.tsx
import React from 'react';

interface Item {
  id: number;
  name: string;
  category: string;
}

interface PresentationProps {
  items: Item[];
  handleCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  fetchData: () => void;
}

const PresentationComponent: React.FC<PresentationProps> = ({
  items,
  handleCategoryChange,
  fetchData,
}) => {
  return (
    <div>
      <label htmlFor='category'>Category:</label>
      <select id='category' onChange={handleCategoryChange}>
        <option value='all'>All</option>
        <option value='Category A'>Category A</option>
        <option value='Category B'>Category B</option>
      </select>
      <button onClick={fetchData}>Fetch Data</button> {/* 추가된 버튼 */}
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PresentationComponent;
