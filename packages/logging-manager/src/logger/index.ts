/*
-
로깅 라이브러리
https://hackernoon.com/the-10-best-nodejs-logging-libraries
Pino
Winston
Bunyan
Morgan
Loglevel
Log4js
Npmlog
Roarr
Tracer
Signale

-
Winston에는 RFC5424 문서에 설명된 지침에 따라 배열된 6가지 기본 로깅 수준이 있습니다.   
{
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}
*/

import { LOG_LEVEL, LOG_GROUP_KEY } from './constant/index';
import {
  TypedAnyFunction,
  TypedAnyObject,
  TypedLogGroupKey,
  OptionsParam,
} from './types/index';

/**
 * 유틸 함수
 */
const getListFindItem = (
  list: any[] = [],
  findFunction: TypedAnyFunction = () => {},
  { isFindItemRemove }: { isFindItemRemove?: boolean } = {},
) => {
  const index = list.findIndex(findFunction);
  let result = null;

  if (-1 < index) {
    result = list[index]; // 조건에 따라 검색된 값
    isFindItemRemove && list.splice(index, 1); // 검색된 값 배열에서 제거
  }

  return result;
};
const findLevel = (item: any) => typeof item === 'string' && item in LOG_LEVEL;
const findLogFunction = (item: any) => typeof item === 'function';
const findOptions = (options: any) =>
  options &&
  typeof options === 'object' &&
  (Object.values(options).some(
    value => findLevel(value) || findLogFunction(value),
  ) ||
    Object.keys(options).some(key => key === LOG_GROUP_KEY));
const isLogGroup = (
  optionValue: string | undefined | null,
  logGroupValue: string | undefined | null,
) => !!optionValue && !!logGroupValue && optionValue === logGroupValue;

/**
 * logger 전용 커링 함수
 */
function curry(callback: TypedAnyFunction): any {
  // 이 부분에 클로저 변수를 선언하면, curry 하려는 모든 callback 함수에 해당 변수가 글로벌하게 작동한다.
  /*
  const logger = curry(() => {});
  const test1 = logger('TEST1');
  const test2 = logger('TEST2');
  test1, test2 모두 같은 클로저 변수를 바라보기 때문에, 의도한대로 코드가 작동안할 수 있음 
  */
  return function curried(
    this: {
      level?: OptionsParam['level'] | null;
      logFunction?: OptionsParam['logFunction'] | null;
      logGroup?: OptionsParam[TypedLogGroupKey] | null;
    },
    ...args: any[]
  ): any {
    const options: OptionsParam | null = getListFindItem(args, findOptions, {
      isFindItemRemove: true,
    });
    const level: OptionsParam['level'] | null =
      this?.level ||
      options?.level ||
      getListFindItem(args, findLevel, { isFindItemRemove: true });
    const logFunction: OptionsParam['logFunction'] | null =
      this?.logFunction ||
      options?.logFunction ||
      getListFindItem(args, findLogFunction, { isFindItemRemove: true });
    const logGroup: OptionsParam[TypedLogGroupKey] | null =
      this?.logGroup || options?.logGroup || null;

    // 최종 조건 만족시 콜백 함수 실행
    if (
      /*callback.length <= args.length ||*/
      (level && 1 <= args.length) ||
      (logFunction && 1 <= args.length) ||
      (logGroup && 1 <= args.length) ||
      (!level && !logFunction && !logGroup && 1 <= args.length)
    ) {
      return callback?.apply(null, [level, logFunction, logGroup, ...args]);
    }

    // 클로저 함수
    return (...moreArgs: any[]): any =>
      curried.apply({ level, logFunction, logGroup }, args.concat(moreArgs));
  };
}

/**
 * 로깅 기능
 */
const logger = curry(
  (
    // curry (커링) 함수의 경우, 파라미터의 기본값 설정 금지!
    level: OptionsParam['level'], // 로그 레벨 지정
    logFunction: OptionsParam['logFunction'] | null, // 로그 출력 함수 지정
    logGroup: OptionsParam[TypedLogGroupKey] | null, // logGroup 옵션 주입 값
    ...payload: any[]
  ): any => {
    try {
      let logGroupValue = null;
      if (typeof window === 'undefined') {
        // 서버 사이드
        logGroupValue = process.env.NEXT_PUBLIC_LOG_GROUP;
      } else {
        // 클라이언트 사이드
        logGroupValue = new URLSearchParams(document.location.search).get(
          LOG_GROUP_KEY,
        );
      }
      if (logGroupValue && !isLogGroup(logGroup, logGroupValue)) {
        return;
      }
    } catch (error) {
      // ...
    }

    if (!level) {
      level = LOG_LEVEL.DEBUG;
    }
    if (!logFunction) {
      switch (level) {
        case LOG_LEVEL.FATAL:
        case LOG_LEVEL.ERROR:
          logFunction = console?.error;
          break;
        case LOG_LEVEL.WARN:
          logFunction = console?.warn;
          break;
        case LOG_LEVEL.INFO:
          logFunction = console?.info;
          break;
        case LOG_LEVEL.DEBUG:
          logFunction = console?.debug;
          break;
      }
      if (!logFunction) {
        logFunction = console.log;
      }
    }

    return logFunction(
      ...[level, logGroup]
        .reduce((accumulator: string[], item: any) => {
          item && accumulator.push(`[${item}]`);
          return accumulator;
        }, [])
        .concat(payload),
    );
  },
);
logger.error = logger(LOG_LEVEL.ERROR);
logger.warn = logger(LOG_LEVEL.WARN);
logger.info = logger(LOG_LEVEL.INFO);
logger.debug = logger(LOG_LEVEL.DEBUG);

export { LOG_LEVEL, LOG_GROUP_KEY, logger };
