# E2E 테스트 - Playwright, Node.js

Playwright 기반 E2E 테스트

핵심 요건

- 지속가능한 UI 테스트환경 구축
  - Playwright 제공하는 codegen 통해, 테스트코드 손쉽게 생성
  - 손쉽게 테스트 수행 과정 및 결과 확인 (GUI 환경, PWA 활용 설치형)
  - Playwright 활용 코드 병목 확인 -> GPT 활용 코드 제안 및 가이드 제공
  - 점진적 활용성 증대
- 테스트환경에서 이슈 사전 확인 및 조치
- 다양한 테스트케이스 실행환경
  - 스케줄러(크론탭) 활용으로 테스트 케이스 실행 자동화
  - 서비스 배포(CD)간 필수 테스트 케이스 실행
  - 웹페이지에서 웹소켓을 통해, 테스트 케이스 실행 및 모니터링 가능
  - 점진적으로 화면성능, 메모리, 최적화 가이드 등 데이터 시각화 및 자동화
- 웹훅을 통해 테스트 수행간 이슈 메시지 전파

환경(서버) 구축

- Node.js + Express 기반환경 구축
- TypeScript 서버 구축 (로컬개발환경, 컴파일)
- WebSocket 서버 + 클라이언트 개발 (웹소켓으로 테스트 케이스 실행 및 응답)
- 테스트케이스 리스트 반환 등 API 기초 개발 (라우트)
- CLI 명령으로 테스트케이스 실행 가능하도록 개발 (CD 연동 또는 스케줄러 연동)
- WebHook 연동 (슬랙)
- Playwright 도구 Helper 개발

클라이언트 개발

- 화면설계
- 컴포넌트 개발

## 용어

- 테스트 시나리오(Test Scenario)는 테스트 실행을 위한 일련의 활동을 구체적으로 기술해둔 문서
- 테스트 케이스(Test Case)는 특정 목적 또는 테스트 조건의 확인을 위해 개발된 입력 값, 실행 사전 조건, 예상 결과 및 실행 사후 조건 등을 포함은 내용의 집합
- 테스트(Test)란 한 개 이상의 테스트 케이스의 집합

네이밍 관련  
https://docs.aws.amazon.com/ko_kr/cloud9/latest/user-guide/build-run-debug.html

- 러너(runner): 실행기
- 런(run): 실행

## tsconfig.json

테스트케이스가 TypeScript(.ts) 파일이 아닌 JavaScript(.js) 파일로 작성될 수 있음

```json
{
  "extends": "@makestory/config/tsconfig.server.json",
  "compilerOptions": {
    "outDir": "dist",
    "allowJs": true, //  자바스크립트 파일 컴파일 허용 여부
    "checkJs": true, // js 파일의 오류 검사 여부
    "paths": {
      "#/*": ["./*"],
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "**/*.d.ts"],
  "exclude": ["node_modules"]
}
```
