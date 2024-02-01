/**
 * [example] Context API 사용
 */
import { PropsWithChildren, createContext, useContext, useState } from 'react';

import { AuthContextValue, User } from './type';

// Context 생성 변수명은 대문자로 시작
// https://ko.legacy.reactjs.org/docs/context.html
export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
