import { combineReducers } from '@reduxjs/toolkit';

import loading from '@/common/store/loading/slice';
import product from '@/common/store/product/slice';

/**
 * 각각의 reducer 를 하나로 합쳐준다.
 */
export default combineReducers({
  loading,
  product,
});
