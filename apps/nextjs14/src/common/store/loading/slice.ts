/**
 * 공통 로딩 상태관리
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { InitialSliceState } from './type';

const initialState: InitialSliceState = {};

// https://redux-toolkit.js.org/api/createSlice
export const slice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setStartLoading: (state, { payload }: PayloadAction<string>) => {
      state[payload] = true;
    },
    setFinishLoading: (state, { payload }: PayloadAction<string>) => {
      state[payload] = true;
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

export const { setStartLoading, setFinishLoading } = slice.actions;
export default slice.reducer;
