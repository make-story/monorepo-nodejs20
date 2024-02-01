/**
 * 공통 타입 정의
 */
import {
  ToolkitStore,
  EnhancedStore,
} from '@reduxjs/toolkit/dist/configureStore';
import { Persistor } from 'redux-persist';

declare module '@reduxjs/toolkit/dist/configureStore' {
  interface ToolkitStore {
    //interface EnhancedStore {
    __persistor?: Persistor;
    //sagaTask?: Task; // redux saga 사용할 경우
  }
}
