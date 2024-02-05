# NPM 패키지

## Next.js 13 이상, 서버 컴포넌트에 대응할 수 있어야 함

"use client"

코드 상단에 명시하거나, 사용하는 쪽에서의 가이드 필요!

`vite 빌드 도구 사용의 경우, build.rollupOptions.output.banner = '"use client";' 값 설정!`

## Vite 빌드

https://velog.io/@phw3071/2.-React-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EB%B9%8C%EB%93%9C%ED%95%98%EA%B3%A0-%ED%85%8C%EC%8A%A4%ED%8A%B8%ED%95%98%EA%B8%B0

https://jgjgill-blog.netlify.app/post/create-your-own-component-library/

## Vite TypeScript

Vite 에 영향을 주는 tsconfig.js 설정  
https://ko.vitejs.dev/guide/features.html

## packages 내부 NPM 패키지 신규 개발 및 수정할 경우

빌드된 파일이 있을 경우, 해당 NPM 패키지를 참조하는 쪽에서는 \*.d.ts 파일을 우선적으로 바라본다.  
개발중인 파일을 바로 바라 보고 싶을 떄에는 빌드된 결과물을 지우면 바로 참조가 가능!  
또는 개발(또는 수정) 후 다시 빌드하고 import 하는 곳에서 테스트

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

아래 설정이 각 모듈의 tsconfig.json 에 설정되어야 한다!!

https://github.com/vercel/turbo/blob/main/examples/basic/packages/ui/tsconfig.json

```json
"compilerOptions": {
    "outDir": "dist"
}
```

## 배포 시 번들링 과정이 필요한 이유

https://ko.vitejs.dev/guide/why.html#why-bundle-for-production

## 커멘드라인

```json
{
  "scripts": {
    "dev": "vite", // 개발 서버를 실행합니다. (`vite dev` 또는 `vite serve`로도 시작이 가능합니다.)
    "build": "vite build", // 배포용 빌드 작업을 수행합니다.
    "preview": "vite preview" // 로컬에서 배포용 빌드에 대한 프리뷰 서버를 실행합니다.
  }
}
```
