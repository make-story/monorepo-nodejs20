// Filter1.tsx
import React from 'react';

interface Filter1Props {
  buttons: string[];
  selectedButton: string | null;
  onSelectButton: (button: string) => void;
}

const Filter1: React.FC<Filter1Props> = ({
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

export default Filter1;
