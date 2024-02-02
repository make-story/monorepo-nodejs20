import { ButtonHTMLAttributes } from 'react';

export interface PrimaryButtonProps {
  label: string;
}
export const PrimaryButton = (
  props: PrimaryButtonProps & ButtonHTMLAttributes<HTMLButtonElement>,
) => {
  return <button {...props}>{props.label}</button>;
};
