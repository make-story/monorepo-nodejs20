import { combineReducers } from '@reduxjs/toolkit';

import counter from '@/testManagement/store/counter/slice';

/**
 * 각각의 reducer 를 하나로 합쳐준다.
 */
export default combineReducers({
  counter,
});
