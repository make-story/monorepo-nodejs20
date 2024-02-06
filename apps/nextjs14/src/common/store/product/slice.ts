/**
 * [example]
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { InitialSliceState } from './type';

const initialState: InitialSliceState = {
  status: 'idle',
  serverData: {
    userId: null,
    id: null,
    title: null,
    completed: false,
  },
};

export const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    initializeProduct: (state, { payload }: PayloadAction<any>) => {
      state = {
        ...initialState,
        ...payload,
      };
    },
    setProductStatus: (
      state,
      { payload }: PayloadAction<InitialSliceState['status']>,
    ) => {
      state.status = payload;
    },
    setServerData: (
      state,
      { payload }: PayloadAction<InitialSliceState['serverData']>,
    ) => {
      state.serverData = {
        ...state.serverData,
        ...payload,
      };
    },
  },
  // 비동기 액션 (Thunk 활용)
  /*extraReducers: builder => {
    builder
      // 통신 중
      .addCase(fetchTodos.pending, state => {
        state.error = null;
        state.loading = true;
      })
      // 통신 성공
      .addCase(fetchTodos.fulfilled, (state, { payload }) => {
        state.error = null;
        state.loading = false;
        state.todos = payload;
      })
      // 통신 에러
      .addCase(fetchTodos.rejected, (state, { payload }) => {
        state.error = payload;
        state.loading = false;
      });
  },*/
});

export const { initializeProduct, setProductStatus, setServerData } =
  slice.actions;
export default slice.reducer;
