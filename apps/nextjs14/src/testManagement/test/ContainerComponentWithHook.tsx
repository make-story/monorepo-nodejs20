// ContainerComponentWithHook.tsx
import React from 'react';
import useFilterItems from './useFilterItems';
import PresentationComponent from './PresentationComponent';

const ContainerComponentWithHook: React.FC = () => {
  const { items, handleCategoryChange, fetchData } = useFilterItems();

  return (
    <PresentationComponent
      items={items}
      handleCategoryChange={handleCategoryChange}
      fetchData={fetchData}
    />
  );
};

export default ContainerComponentWithHook;
