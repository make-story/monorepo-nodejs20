import React from 'react';
import FilterSelector, {
  Select,
  Option,
  Checkbox,
  Input,
} from './FilterSelector';

const App: React.FC = () => {
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('Selected category:', e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Checkbox checked:', e.target.checked);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input value:', e.target.value);
  };

  return (
    <FilterSelector>
      <Select id='category' onChange={handleCategoryChange}>
        <Option value='all'>All</Option>
        <Option value='Category A'>Category A</Option>
        <Option value='Category B'>Category B</Option>
      </Select>
      <Checkbox id='checkbox1' onChange={handleCheckboxChange} />
      <Checkbox id='checkbox2' onChange={handleCheckboxChange} />
      <Input id='input1' onChange={handleInputChange} />
      <Input id='input2' onChange={handleInputChange} />
    </FilterSelector>
  );
};

export default App;
