// FilterContainer.tsx
import React, { useState } from 'react';
import Filter1 from './Filter1';
import Filter2 from './Filter2';
import Filter3 from './Filter3';

const FilterContainer: React.FC = () => {
  const [selectedFilter1, setSelectedFilter1] = useState<string | null>(null);
  const [selectedFilter2, setSelectedFilter2] = useState<string | null>(null);
  const [selectedFilter3, setSelectedFilter3] = useState<string | null>(null);

  // Filter1 선택 시
  const handleFilter1Select = (button: string) => {
    setSelectedFilter1(button);
    // Filter2에 대한 선택 초기화
    setSelectedFilter2(null);
  };

  // Filter2 선택 시
  const handleFilter2Select = (button: string) => {
    setSelectedFilter2(button);
    // Filter3에 대한 선택 초기화
    setSelectedFilter3(null);
  };

  // Filter3 선택 시
  const handleFilter3Select = (button: string) => {
    setSelectedFilter3(button);
  };

  // 각 Filter의 버튼 리스트
  const filter1Buttons = ['Button 1-1', 'Button 1-2', 'Button 1-3'];
  const filter2Buttons = ['Button 2-1', 'Button 2-2', 'Button 2-3'];
  const filter3Buttons = ['Button 3-1', 'Button 3-2', 'Button 3-3'];

  return (
    <div>
      <Filter1
        buttons={filter1Buttons}
        selectedButton={selectedFilter1}
        onSelectButton={handleFilter1Select}
      />
      {selectedFilter1 && (
        <Filter2
          buttons={filter2Buttons}
          selectedButton={selectedFilter2}
          onSelectButton={handleFilter2Select}
        />
      )}
      {selectedFilter2 && (
        <Filter3
          buttons={filter3Buttons}
          selectedButton={selectedFilter3}
          onSelectButton={handleFilter3Select}
        />
      )}
    </div>
  );
};

export default FilterContainer;
