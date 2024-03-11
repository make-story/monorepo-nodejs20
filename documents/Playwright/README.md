## Playwright

https://www.npmjs.com/package/@playwright/test

https://www.sktenterprise.com/bizInsight/blogDetail/dev/5536

cypress 와 비교  
https://eleks.com/research/playwright-vs-cypress/
https://shorttrack.tistory.com/7

## 브라우저 다운로드 실행

https://playwright.dev/docs/release-notes#breaking-changes-playwright-no-longer-downloads-browsers-automatically

https://playwright.dev/docs/library#browser-downloads

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

## React, Vue, Svelte

https://playwright.dev/docs/test-components#how-can-i-use-router

## GitHub Actions CI

https://playwright.dev/docs/ci-intro
