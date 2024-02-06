export interface InitialSliceState {
  status: 'idle' | 'loading' | 'failed';
  serverData: {
    userId: null | number;
    id: null | number;
    title: null | string;
    completed: boolean;
  };
}
