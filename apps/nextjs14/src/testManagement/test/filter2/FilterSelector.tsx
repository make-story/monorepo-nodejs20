import React from 'react';

interface FilterSelectorProps {
  children: React.ReactNode;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({ children }) => {
  return <div>{children}</div>;
};

interface SelectProps {
  id: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ id, onChange, children }) => {
  return (
    <div>
      <label htmlFor={id}>{children}:</label>
      <select id={id} onChange={onChange}>
        {children}
      </select>
    </div>
  );
};

interface OptionProps {
  value: string;
  children: React.ReactNode;
}

export const Option: React.FC<OptionProps> = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};

export const Checkbox: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = props => {
  return <input type='checkbox' {...props} />;
};

export const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = props => {
  return <input type='text' {...props} />;
};

export default FilterSelector;
