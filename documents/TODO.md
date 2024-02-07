# 해야할 것

## 사전 확인 할 것 (설계)

- Redux Toolkit Thunk 사용 예
  - https://redux-toolkit.js.org/usage/usage-guide#async-requests-with-createasyncthunk
- 사용자훅, HOC 실무활용 예제
- webview 유틸 (event-manager 활용)
- 마이크로 프론트 기초 환경

- ESLint 계층간 의존성 제어 - 완료
- Fetch 매니저 - 완료
- RTK Query - 완료
- event-bus 매니저 - 완료
  - 이벤트 proxy 기능? 또는 인터셉터 기능?
- log 매니저 - 완료
  - URL 파라미터에 logGroup=값 으로 해당 로그만 보이기/숨기기 제어
  - NEXT_PUBLIC_LOG_GROUP 환경변수 값으로 서버에서는 구분
- ui 패키지 - 완료
  - 스토리북, 디자인시스템 분리 기준!
    - element, module, template

## 페이지 개발간 할 것 (예제)

- redux toolkit thunk
- 사용자 훅 예제
- HOC 예제
- 디자인시스템 > 아토믹 디자인 > 컴포넌트 예제
- 유연한 컴포넌트 설계 기법 예제 (props 증가가 아닌, 합성컴포넌트 방식!)

## 장기 계획

- 마이크로프론트엔드 적용 (웹팩 활용)

- MSW

  - https://github.com/vercel/next.js/tree/canary/examples/with-msw
  - https://github.com/mswjs/msw/issues/1644
  - https://jaypedia.tistory.com/382
  - https://velog.io/@minsang9735/NextJS%EC%97%90%EC%84%9C-MSW%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EC%9E%90
  - https://velog.io/@shinhw371/Nextjs-13-MSW-Failure-Record

# Next.js + API Mock Service Worker (MSW)

https://jaypedia.tistory.com/382

https://velog.io/@minsang9735/NextJS%EC%97%90%EC%84%9C-MSW%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EC%9E%90

https://velog.io/@shinhw371/Nextjs-13-MSW-Failure-Record

https://medium.com/@iamkjw/msw%EB%A1%9C-api-%EB%AA%A8%ED%82%B9%ED%95%98%EA%B8%B0-29c80bbed37b

공식홈페이지  
https://mswjs.io/docs/cli/init/
