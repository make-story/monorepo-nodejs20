/**
 * [example] Context API 사용
 */
import { useContext } from 'react';

import { CardContext } from './context';
import { CardContextValue } from './type';

export function useContextCard(): CardContextValue {
  const card = useContext(CardContext);

  if (!card) {
    throw new Error('CardProvider id not used');
  }

  return card;
}
