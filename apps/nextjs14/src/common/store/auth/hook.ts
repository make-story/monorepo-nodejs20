/**
 * [example] Context API 사용
 */
import { useContext } from 'react';

import { AuthContext } from './context';
import { AuthContextValue } from './type';

export function useContextAuth(): AuthContextValue {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error('AuthProvider id not used');
  }

  return auth;
}
