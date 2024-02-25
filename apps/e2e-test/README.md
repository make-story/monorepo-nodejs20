# E2E 테스트

Playwright 기반의 E2E 테스트

- 웹페이시에서 웹소켓을 통해 테스트 케이스 실행 가능
- 웹훅을 통해 테스트 수행간 이슈 메시지 전달
- 배포간 실행가능한 CLI 실행 가능

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

## 테스트 코드 생성

https://playwright.dev/docs/codegen-intro

## GitHub Actions CI

https://playwright.dev/docs/ci-intro

## 용어

- 테스트 시나리오(Test Scenario)는 테스트 실행을 위한 일련의 활동을 구체적으로 기술해둔 문서
- 테스트 케이스(Test Case)는 특정 목적 또는 테스트 조건의 확인을 위해 개발된 입력 값, 실행 사전 조건, 예상 결과 및 실행 사후 조건 등을 포함은 내용의 집합
- 테스트(Test)란 한 개 이상의 테스트 케이스의 집합

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
