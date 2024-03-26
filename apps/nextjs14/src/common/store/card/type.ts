export interface User {
  id: number;
  username: string;
}

export interface CardContextValue {
  user: User | null;
  setUser(user: User): void;
}
