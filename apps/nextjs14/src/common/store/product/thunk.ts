/**
 * [example]
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTodos = createAsyncThunk(
  'common/product/fetchTodos',
  async () => {
    const response = await axios.get('/fakeApi/todos');
    return response.data;
  },
);
