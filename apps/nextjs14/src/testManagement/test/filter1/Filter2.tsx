// Filter2.tsx
import React from 'react';

interface Filter2Props {
  buttons: string[];
  selectedButton: string | null;
  onSelectButton: (button: string) => void;
}

const Filter2: React.FC<Filter2Props> = ({
  buttons,
  selectedButton,
  onSelectButton,
}) => {
  return (
    <div>
      {buttons.map(button => (
        <button
          key={button}
          onClick={() => onSelectButton(button)}
          style={{
            backgroundColor: selectedButton === button ? 'lightblue' : 'white',
          }}
        >
          {button}
        </button>
      ))}
    </div>
  );
};

export default Filter2;
