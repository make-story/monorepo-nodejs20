/**
 * [example] Redux Toolkit 사용
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { InitialSliceState } from './type';

const initialState: InitialSliceState = {
  value: 0,
};

export const slice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    initializeCounter: (state, { payload }: PayloadAction<any>) => {
      state = {
        ...initialState,
        ...payload,
      };
    },
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    incrementByAmount: (state, { payload }: PayloadAction<number>) => {
      state.value += payload;
    },
  },
});

export const { initializeCounter, increment, decrement, incrementByAmount } =
  slice.actions;
export default slice.reducer;
