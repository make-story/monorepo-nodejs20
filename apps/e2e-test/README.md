# E2E 테스트

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

## Playwright

https://www.npmjs.com/package/@playwright/test

https://www.sktenterprise.com/bizInsight/blogDetail/dev/5536

cypress 와 비교  
https://eleks.com/research/playwright-vs-cypress/
https://shorttrack.tistory.com/7

- 성능
- 다양한 브라우저 지원
- 병렬처리
- 멀티 Tab 지원

## 브라우저 다운로드 실행

https://playwright.dev/docs/release-notes#breaking-changes-playwright-no-longer-downloads-browsers-automatically

package.json

```json
{
  "devDependencies": {
    "playwright": "1.38.0",
    "@playwright/browser-chromium": "1.38.0",
    "@playwright/browser-firefox": "1.38.0",
    "@playwright/browser-webkit": "1.38.0"
  }
}
```

또는 @playwright/test 설치된 경우

```bash
$ yarn playwright install
yarn run v1.22.19
$ playwright install
Downloading Chromium 121.0.6167.57 (playwright build v1097) from https://playwright.azureedge.net/builds/chromium/1097/chromium-mac-arm64.zip
130.8 MiB [====================] 100% 0.0s
Chromium 121.0.6167.57 (playwright build v1097) downloaded to /Users/sung-minyu/Library/Caches/ms-playwright/chromium-1097
Downloading FFMPEG playwright build v1009 from https://playwright.azureedge.net/builds/ffmpeg/1009/ffmpeg-mac-arm64.zip
1 MiB [====================] 100% 0.0s
FFMPEG playwright build v1009 downloaded to /Users/sung-minyu/Library/Caches/ms-playwright/ffmpeg-1009
Downloading Firefox 121.0 (playwright build v1438) from https://playwright.azureedge.net/builds/firefox/1438/firefox-mac-13-arm64.zip
74.4 MiB [====================] 100% 0.0s
Firefox 121.0 (playwright build v1438) downloaded to /Users/sung-minyu/Library/Caches/ms-playwright/firefox-1438
Downloading Webkit 17.4 (playwright build v1967) from https://playwright.azureedge.net/builds/webkit/1967/webkit-mac-13-arm64.zip
63.6 MiB [====================] 100% 0.0s
Webkit 17.4 (playwright build v1967) downloaded to /Users/sung-minyu/Library/Caches/ms-playwright/webkit-1967
```

## Code Generator (코드 제너레이팅)

손쉬운 테스트 코드 생성

### Playwright 제공

https://playwright.dev/docs/codegen-intro

https://playwright.dev/docs/codegen#recording-a-test

```bash
$ npx playwright codegen https://playwright.dev/

$ npx playwright codegen --device="iPhone 13" https://playwright.dev/

$ npx playwright codegen --color-scheme=dark playwright.dev

# 세션정보 저장 - save cookies / localStorage
# 해당 명령 사용할 경우, .gitignore 에 저장파일 설정 (예: auth.json)
$ npx playwright codegen github.com/microsoft/playwright --save-storage=auth.json
```

package.json 에 scripts 추가하여 활용

```json
{
  "scripts": {
    "playwright": "playwright",
    "codegen:pc": "playwright codegen",
    "codegen:mobile": "playwright codegen --device='iPhone 13'"
  }
}
```

- --device='Galaxy S9+' 경우 크롬 실행
- --device='iPhone 13' 경우 사파리 실행

node_modules/playwright-core/types/types.d.ts

```bash
$ yarn codegen:pc https://playwright.dev/

$ yarn codegen:mobile https://playwright.dev/
```

### 크롬 확장프로그램

https://chromewebstore.google.com/detail/deploysentinel-recorder/geggbdbnidkhbnbjoganapfhkpgkndfo

## GitHub Actions CI

https://playwright.dev/docs/ci-intro

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

## WebSocket Server/Client

`MDN` 참고  
https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

`NPM Trends` 참고  
https://npmtrends.com/socket.io-vs-websocket-vs-ws

- Socket.IO
  https://socket.io/
- SocketCluster
  https://socketcluster.io/
- WebSocket-Node
  https://github.com/theturtle32/WebSocket-Node
- `ws`
  https://github.com/websockets/ws

https://github.com/theturtle32/WebSocket-Node

https://www.pubnub.com/blog/nodejs-websocket-programming-examples/

https://medium.com/@PubNub/node-js-websocket-programming-examples-f6b8e15f8f85

```bash
$ yarn add ws @types/ws
```

### Node.js 21 버전 - WebSocket 내장

https://nodejs.org/en/blog/announcements/v21-release-announce#built-in-websocket-client

https://github.com/nodejs/undici/tree/main/test/websocket

https://www.nearform.com/insights/whats-new-in-node-js-21/

```javascript
// example.js
const ws = new WebSocket('wss://echo.websocket.events/');

ws.addEventListener('message', event => {
  console.log('received:', event.data); // "echo.websocket.events sponsored by Lob.com"
});

ws.addEventListener('open', () => {
  let i = 0;
  setInterval(() => {
    const text = `hello. This is message number #${i}`;
    console.log('sending:', text);
    ws.send(text);
    i++;
  }, 1000);
});
```

```
$ node --experimental-websocket example.js
```
