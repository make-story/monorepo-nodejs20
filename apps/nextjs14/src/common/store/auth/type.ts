export interface User {
  id: number;
  username: string;
}

export interface AuthContextValue {
  user: User | null;
  setUser(user: User): void;
}
