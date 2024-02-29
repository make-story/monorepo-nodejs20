/**
 * [example]
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { InitialSliceState } from './type';
import { fetchTodos } from './thunk';

const initialState: InitialSliceState = {
  status: 'idle',
  entities: [],
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
    test(state, actions) {
      const { type, payload } = actions;

      // ...
    },
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
  // https://ko.redux.js.org/tutorials/fundamentals/part-8-modern-redux/#writing-thunks
  // 비동기 처리를 할 때의 3가지 상태(pending, fulfilled, rejected)마다 수동적으로 state를 정의
  extraReducers: builder => {
    builder
      // 통신 중
      .addCase(fetchTodos.pending, state => {
        state.status = 'loading';
        //state.error = null;
      })
      // 통신 성공
      .addCase(fetchTodos.fulfilled, (state, { type, payload }) => {
        state.status = 'idle';
        //state.error = null;
        const newEntities: { [key: string | number | symbol]: any } = {};
        payload.forEach((todo: any) => {
          newEntities[todo.id] = todo;
        });
        state.entities = newEntities;
      })
      // 통신 에러
      .addCase(fetchTodos.rejected, (state, { type, payload }) => {
        state.status = 'failed';
        //state.error = payload;
      });
  },
});

export const { initializeProduct, setProductStatus, setServerData } =
  slice.actions;
export default slice.reducer;
