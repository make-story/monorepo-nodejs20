/**
 * https://react-ko.dev/reference/react-dom/createPortal
 */
'use client';

import {
  PropsWithChildren,
  ReactElement,
  useEffect,
  ReactNode,
  JSXElementConstructor,
} from 'react';
import { createPortal } from 'react-dom';

function Portal({
  children,
}: PropsWithChildren<{
  children: any;
}>): void {
  useEffect(() => {
    createPortal(
      children,
      window.document.getElementById('root') as HTMLElement,
    );
  }, [children]);
}

export default Portal;
