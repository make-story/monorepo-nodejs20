// Filter3.tsx
import React from 'react';

interface Filter3Props {
  buttons: string[];
  selectedButton: string | null;
  onSelectButton: (button: string) => void;
}

const Filter3: React.FC<Filter3Props> = ({
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

export default Filter3;
