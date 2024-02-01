/**
 * 타입
 */
import { LOG_LEVEL, LOG_GROUP_KEY } from '../constant/index';

export type TypedAnyFunction = (...payload: any[]) => any;
export type TypedAnyObject = { [key: string | number | symbol]: any };
export type TypedLogGroupKey = typeof LOG_GROUP_KEY;
export interface OptionsParam {
  level?: (typeof LOG_LEVEL)[keyof typeof LOG_LEVEL];
  logFunction?: TypedAnyFunction;
  [LOG_GROUP_KEY]?: string;
}
