import { PropsWithChildren, ButtonHTMLAttributes } from 'react';

export default function Button({
  children,
  attr,
}: PropsWithChildren<{ attr?: ButtonHTMLAttributes<HTMLButtonElement> }>) {
  return <button disabled={attr?.disabled}>{children}</button>;
}
