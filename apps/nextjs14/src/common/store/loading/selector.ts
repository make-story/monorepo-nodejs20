/**
 * 공통 로딩 상태관리
 */
import type { RootState } from '@/store';

export const selectLoadingStatus = (state: RootState) => state.common.loading;
