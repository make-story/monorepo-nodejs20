import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// https://github.com/shadcn-ui/ui/blob/main/apps/www/lib/utils.ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
