export * from './test/fetch';

import { testApi } from './test/hook';

export const rtkQuery = {
  reducer: {
    [testApi.reducerPath]: testApi.reducer,
  },
  middleware: [testApi.middleware],
};
