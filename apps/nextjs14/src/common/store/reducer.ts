import { combineReducers } from '@reduxjs/toolkit';

import product from '@/common/store/product/slice';

/**
 * 각각의 reducer 를 하나로 합쳐준다.
 */
export default combineReducers({
  product,
});
