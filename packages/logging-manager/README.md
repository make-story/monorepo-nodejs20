# 로그(console) 관리

> 특정버전 호환이 필요한 의존성 모듈은 package.json 에 peerDependencies 항목에도 의존성 패키지 및 버전 명시 필수!

`패키지를 사용하는 쪽에 현재 패키지가 의존하는 라이브러리 버전 설치 필수라는 것 명시!`  
`실제로 패키지에서 직접 require(import) 하지는 않더라도 호환성이 필요한 경우 명시!`

## example

```tsx
import { useEffect } from 'react';
import { LOG_LEVEL, LOG_GROUP_KEY, logger } from '@lotte/logging-manager';

const LogTest = () => {
  useEffect(() => {
    // 로그레벨 수동 지정, 출력함수 수동 지정
    logger(LOG_LEVEL.ERROR, console.debug, 'test1', 'test-1');

    // 로그레벨 수동 지정, 출력함수 수동 지정
    logger(LOG_LEVEL.WARN)(console.log)('test2', 'test-2');

    // 출력함수 수동 지정
    logger(console.warn)('test3', 'test-3');

    // 단순 로그 출력
    logger('test4', 'test-4');

    // 로그레벨 제공 함수에 따른 로그 출력
    logger.error('test5', 'test-5');
    logger.warn('test6', 'test-6');
    logger.info('test7', 'test-7');
    logger.debug('test8', 'test-8');

    // 로그그룹 지정 - URL 파라미터에 해당 로그 그룹을 지정할 경우, 다른 로그는 자동 숨김처리
    logger({ level: LOG_LEVEL.WARN, [LOG_GROUP_KEY]: LOG_LEVEL.WARN })(
      `로그 그룹을 "${LOG_LEVEL.WARN}" 라는 값으로 설정!`,
    );
    logger({ level: LOG_LEVEL.ERROR, [LOG_GROUP_KEY]: 'test' })(
      '로그 그룹을 "test" 라는 값으로 설정!',
    );

    // 로그 수동 지정 후 이를 재활용
    const log = logger(LOG_LEVEL.WARN)(console.log);
    log('1');
    log('2', '3');
  }, []);

  return <></>;
};

export default LogTest;
```
