/**
 * [example]
 */
import type { RootState } from '@/store';

export const selectProductStatus = (state: RootState) =>
  state.common.product?.status;
