// FilterSelector.tsx
import React from 'react';

interface FilterSelectorProps {
  handleCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({
  handleCategoryChange,
}) => {
  return (
    <div>
      <label htmlFor='category'>Category:</label>
      <select id='category' onChange={handleCategoryChange}>
        <option value='all'>All</option>
        <option value='Category A'>Category A</option>
        <option value='Category B'>Category B</option>
      </select>
    </div>
  );
};

export default FilterSelector;
