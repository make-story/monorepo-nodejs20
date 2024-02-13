# NPM 패키지

유성민  
https://www.npmjs.com/settings/yusungmin/packages

## 배포 시 번들링 과정이 필요한 이유

https://ko.vitejs.dev/guide/why.html#why-bundle-for-production

## packages 내부 NPM 패키지 신규 개발 및 수정할 경우

빌드된 파일이 있을 경우, 해당 NPM 패키지를 참조하는 쪽에서는 \*.d.ts 파일을 우선적으로 바라본다.  
개발중인 파일을 바로 바라 보고 싶을 떄에는 빌드된 결과물을 지우면 바로 참조가 가능!  
또는 개발(또는 수정) 후 다시 빌드하고 import 하는 곳에서 테스트

# CommonJS, ESM, TypeScript 지원설정 및 NPM publish 전 빌드실행

```json
{
  "name": "test",
  "version": "0.0.1",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "prepack": "yarn build:tsc", // prepack 은 NPM publish 전 실행
    "build:tsc": "yarn tsc"
  },
  // CommonJS, ESM, TypeScript 지원
  "exports": {
    ".": {
      // 라이브러리의 subpath
      "types": "./dist/index.d.ts", // typescript를 사용하는 경우 사용될 파일을 명시한 conditional 필드 (types 필드는 항상 맨 위에 위치해야 한다.)
      "import": "./dist/index.js", // esm 환경에서 사용될 파일을 명시한 conditional 필드
      "require": "./dist/index.cjs", // cjs 환경에서 사용될 파일을 명시한 conditional 필드
      "default": "./dist/index.js" // default 환경에서 사용될 파일을 명시한 conditional 필드
    }
  },
  "devDependencies": {
    "@types/node": "^18.15.0",
    "typescript": "^4.9.5"
  }
}
```

## tsconfig

타입스크립트는 해당 라이브러리가 타입스크립트를 지원해 주는지 하지 않는지를 타입정의(d.ts) 파일을 찾아서 결정하기 때문에 declaration 을 true 로 설정해 준다.

```json
{
  "compilerOptions": {
    "target": "es6" /* 최신 브라우저는 es6을 대부분 지원한다. */,
    "module": "ES6" /* 모듈 시스템을 지정한다. */,
    "lib": [
      "es5",
      "es6",
      "dom"
    ] /* 타입스크립트가 어떤 버전의 JS의 빌트인 API를 사용할 건지에 대한 것을 명시해 준다. */,
    "declaration": true /* 타입스크립트가 자동으로 타입정의 (d.ts) 파일을 생성해 준다. */,
    "outDir": "dist" /* 컴파일된 결과물을 어디에 저장할지에 대한 것을 명시해 준다. */,
    "strict": true /* 타입스크립트의 엄격한 모드를 활성화한다. */
  },
  "include": ["src/index.ts"] /* 컴파일할 대상을 명시해 준다. */
}
```

# Next.js

## Next.js 13 이상, 서버 컴포넌트에 대응할 수 있어야 함

"use client"

코드 상단에 명시하거나, 사용하는 쪽에서의 가이드 필요!

`vite 빌드 도구 사용의 경우, build.rollupOptions.output.banner = '"use client";' 값 설정!`

# Vite

## Vite 빌드

https://velog.io/@phw3071/2.-React-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%EB%B9%8C%EB%93%9C%ED%95%98%EA%B3%A0-%ED%85%8C%EC%8A%A4%ED%8A%B8%ED%95%98%EA%B8%B0

https://jgjgill-blog.netlify.app/post/create-your-own-component-library/

```json
{
  "scripts": {
    "dev": "vite", // 개발 서버를 실행합니다. (`vite dev` 또는 `vite serve`로도 시작이 가능합니다.)
    "build": "vite build", // 배포용 빌드 작업을 수행합니다.
    "preview": "vite preview" // 로컬에서 배포용 빌드에 대한 프리뷰 서버를 실행합니다.
  }
}
```

## Vite TypeScript

Vite 에 영향을 주는 tsconfig.js 설정  
https://ko.vitejs.dev/guide/features.html

## Vite tsconfig 이슈

루트 디렉토리에서 터보레포로 빌드할 경우,  
각각의 NPM 패키지(예: fetch-manager) tsconfig.json 의 extends 가 아래와 같이 설정되면  
빌드 파일이 dist/src 뿐만아니라 비정상적으로 모든 패키지 빌드파일이 들어감

```json
{
  "extends": "@makeapi/config/tsconfig.base.json"
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

# Changeset - 모노레포 구성에서 NPM 패키지 배포

Changeset 은 멀티 패키지 환경(monorepo)에서 상호 의존하는 패키지들의 일관성을 유지하기 위한 라이브러리

https://github.com/changesets/changesets

https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md

https://turbo.build/repo/docs/handbook/publishing-packages/versioning-and-publishing

https://jinyisland.kr/post/changeset/

```json
{
  "scripts": {
    "publish-packages": "changeset version && changeset publish"
  }
}
```

## 설치

```
$ yarn add @changesets/cli && yarn changeset init
```

## 환경설정

.changeset/config.json

```
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

- access: 액세스 권한 설정 (restricted, public)
- baseBranch: 변경 감지를 위한 대상 브랜치
- updateInternalDependencies: 종속된 패키지가 변경될 때 같이 업데이트 patch
- commit: false를 통해 사용자가 직접 커밋

## changeset command

changeset 커맨드를 입력하면 패키지들의 변경 사항을 감지  
그런 다음 semver 규칙에 따라 메이저 버전으로 업데이트할지, 아니면 마이너 버전으로 업데이트할지 질의

```
$ yarn changeset

# step01) 업데이트 패키지가 무엇인지 설정한다.
# 🦋  Which packages would you like to include? ...

# step02) 패키지의 SEMVER를 결정한다. 선택되지 않은 패키지는 minor 버전으로 업데이트
# 🦋  Which packages should have a major bump? ...

# step03) 변경 사항을 간략하게 입력합니다.
# 🦋  Please enter a summary for this change (this will be in the changelogs). Submit empty line to open external
```

## version

배포하기로 결정한 후, 다음과 같이 버전 업데이트를 진행  
설정된 업데이트 규칙에 따라 메이저 또는 마이너 버전이 증가하고, 의존하고있는 패키지들도 같이 업데이트  
또한 로그 파일(CHANGELOG.md)도 함께 생성

```
$ yarn changeset version
```

이 단계 이후 changeset publish 명령어를 사용해 내부적으로 .npmrc 파일을 참조해 레지스트리에 배포  
자동 배포를 원하시면 publish를 GitHub Actions에 스크립트를 작성하고 push를 수행

## publish

changeset publish를 실행하면 이전 단계에서 수행한 자동으로 업데이트 예정인 패키지들을 레지스트리에 배포

```
$ yarn changeset publish
```
