export interface InitialSliceState {
  status: 'idle' | 'loading' | 'failed';
  entities: any;
  serverData: {
    userId: null | number;
    id: null | number;
    title: null | string;
    completed: boolean;
  };
}
