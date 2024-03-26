/**
 * [example] Context API 사용
 */
import { PropsWithChildren, createContext, useContext, useState } from 'react';

import { CardContextValue, User } from './type';

// Context 생성 변수명은 대문자로 시작
// https://ko.legacy.reactjs.org/docs/context.html
export const CardContext = createContext<CardContextValue | null>(null);

export function CardProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  return (
    <CardContext.Provider value={{ user, setUser }}>
      {children}
    </CardContext.Provider>
  );
}
