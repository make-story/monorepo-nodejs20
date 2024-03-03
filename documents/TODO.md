# TODO

- React 모범사레 (React Best Practices)
  - https://github.com/codica2/react-app-best-practice/tree/master/src/views/components
  - https://github.com/PacktPublishing/React-18-Design-Patterns-and-Best-Practices-Fourth-Edition
  - https://github.com/garbalau-github/react-best-practices
  - https://usehooks-ts.com/
  - https://reactpatterns.js.org/docs/

## 진행

- UI
  - shadcn-ui 기반 레이아웃
    - https://ui.shadcn.com/docs/dark-mode/next
    - `https://github.com/shadcn-ui/ui/tree/main/apps/www/registry`
  - cva (Class Variance Authority)
    - https://github.com/joe-bell/cva
    - https://velog.io/@woohobi/%EC%9E%AC%EC%82%AC%EC%9A%A9%EC%84%B1%EC%9D%84-%EA%B3%A0%EB%A0%A4%ED%95%9C-UI-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8
  - classnames 또는 clx
    - https://npmtrends.com/classnames-vs-clsx
    - clsx 는 React 에서 클래스 이름을 조건부로 적용하는 데 매우 유용한 라이브러리
  - tailwind-merge
- GraphQL - 기능보완 및 테스트
  - Apollo (API 상태관리 활용 가능)
- Oauth - 기능보완 및 테스트
  - JWT
  - next-auth
- Redux Toolkit Thunk 사용 예
  - https://redux-toolkit.js.org/usage/usage-guide#async-requests-with-createasyncthunk
- 유연한 컴포넌트 설계 방법론 예제
  - Render Props 패턴
  - 합성 컴포넌트 패턴 (Compound Component Pattern)
- 사용자훅, HOC 실무활용 예제

## 완료

- ESLint 계층간 의존성 제어
- RTK Query
- 공통 설정 패키지
- Fetch 매니저
- Event-Bus 매니저
  - 옵션으로 이벤트 proxy 기능 (인터셉터 기능)
  - webview 유틸 (event-manager 활용)
- Log 매니저
  - URL 파라미터에 logGroup=값 으로 해당 로그만 보이기/숨기기 제어
  - NEXT_PUBLIC_LOG_GROUP 환경변수 값으로 서버에서는 구분
- changeset 도구 활용 내부 NPM 배포 환경
- 디자인시스템
  - 스토리북 구축
  - 아토믹디자인 분리 기준 재정의!
    - element, module, template
- Express 커스텀 서버 구성 (TypeScript)
- 마이크로 프론트 기초 환경 구성
- E2E 테스트 기초 환경 구성
- React Native 기초 API 서버 구성
  - NestJS 기반 환경

## 중기/장기 계획

- 마이크로 프론트 구축 안정화
  - 웹팩 활용
  - Next.js 연동
- MSW (API 목업 개발환경 구축)
  - https://github.com/vercel/next.js/tree/canary/examples/with-msw
  - https://github.com/mswjs/msw/issues/1644
  - https://jaypedia.tistory.com/382
  - https://velog.io/@minsang9735/NextJS%EC%97%90%EC%84%9C-MSW%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EC%9E%90
  - https://velog.io/@shinhw371/Nextjs-13-MSW-Failure-Record
- 디자인시스템 고도화
  - 아토믹디자인 분리 기준 경험적 학습 (시행착오)
