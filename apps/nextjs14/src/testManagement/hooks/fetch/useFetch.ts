export const useFetch = () => {
  // axios 등 api 호출
  // get, post 등 HTTP 메소드 타입 받음 > 옵션을 받는 것이 아닌, 추상화된 함수를 받아서, 해당 함수 request() 호출만 관리해준다. 예 useFetch({ request: getTestDataList, fetchManager, param })
  // 로딩 상태 정도 제공
  // 에러 정보 제공
  // 데이터 제공
};
