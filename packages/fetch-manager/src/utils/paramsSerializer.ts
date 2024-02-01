import qs from 'query-string';

/**
 * Params Object를 String으로 선형화하는 Utility
 * - axios의 paramsSerializer 옵션으로 사용
 * - axios v0.x에서 `[`, `]`등의 문자가 Url String으로 Encode 되지 않는 문제에 대응
 *   - 관련이슈: https://github.com/axios/axios/issues/3316
 * - Array 포멧 변환
 *   - { a: [1, 2] } 전달 시
 *     - 적용 전 - a[]=1&a[]=2
 *     - 적용 시 - a=1,2
 *
 * @param params Get Parameters Object
 *
 * @example
 * const getCategoryList = (params: GetParams, fetchManager: FetchManager) =>
 *   fetchManager.api.get('apis/endpoint', {
 *     params,
 *     paramsSerializer,
 *   })
 */
const paramsSerializer = <P extends {}>(params: P) =>
  qs.stringify(params, { arrayFormatSeparator: ',' });

export default paramsSerializer;
