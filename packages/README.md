# NPM 패키지 개발

- Fetch 관리
  - fetch-manager
- Event 관리
  - event-manager
- Logging 관리
  - logging-manager
- 공통 유틸
  - util
- 공통 UI 컴포넌트
  - ui
- 공통 설정 코드관리
  - config

## Next.js 13 이상, 서버 컴포넌트에 대응할 수 있어야 함

"use client"

코드 상단에 명시하거나, 사용하는 쪽에서의 가이드 필요!

`vite 빌드 도구 사용의 경우, build.rollupOptions.output.banner = '"use client";' 값 설정!`

## Vite

Vite 에 영향을 주는 tsconfig.js 설정  
https://ko.vitejs.dev/guide/features.html

## Vite tsconfig 이슈

루트 디렉토리에서 터보레포로 빌드할 경우,  
각각의 NPM 패키지(예: fetch-manager) tsconfig.json 의 extends 가 아래와 같이 설정되면  
빌드 파일이 dist/src 뿐만아니라 비정상적으로 모든 패키지 빌드파일이 들어감

```json
{
  "extends": "@ysm/config/tsconfig.base.json"
}
```

```
dist
├─ apps
├─ packages
├─ index.d.ts
└─ ...
```
