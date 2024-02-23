/**
 * [example] Redux Toolkit 사용
 */
import type { RootState } from '@/store';

export const selectCount = (state: RootState) => state.service.counter.value;
