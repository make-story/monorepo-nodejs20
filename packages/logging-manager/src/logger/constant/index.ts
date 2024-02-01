/**
 * 로그 레벨
 */
export const LOG_LEVEL = {
  FATAL: 'FATAL', // 심각
  ERROR: 'ERROR', // 예외처리, 에러
  WARN: 'WARN', // 경고
  INFO: 'INFO', // 정보
  DEBUG: 'DEBUG', // 디버깅
} as const;

/**
 * 로그 그룹 (URL 파라미터 키)
 */
export const LOG_GROUP_KEY = 'logGroup' as const; // NEXT_PUBLIC_LOG_GROUP_KEY 환경변수에 설정된 값 또는 URL logGroup 파라미터에 설정된 값에 해당하는 로그만 출력
