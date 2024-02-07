# 모노레포

Next.js 14 개발환경 템플릿 테스트

## 설치 > 빌드 > 실행

```bash
# 의존성 NPM 모듈 설치 및 모노레포 세팅
$ yarn
# 트랜스파일링 및 빌드
$ yarn turbo:build
# 서버 실행
$ yarn nextjs14 start
```

## 로컬환경 실행

```bash
# Next.js 일반 개발환경 실행
$ yarn nextjs14 dev
# 또는 Next.js 일반 개발환경 터보팩으로 실행
$ yarn nextjs14 dev:turbo
# 또는 Next.js + Stroybook 등 로컬환경 애플리케이션 모두 실행
$ yarn dev
```

## 스토리북(로컬환경) 실행

```bash
$ yarn storybook dev
```

## 기초환경 및 버전

- Node.js 20 이상 (20.10.0)
- Next.js 14.0.3
- TypeScript 5.x
- Yarn 안정화버전

## 주요 도구

- 전역 상태관리
  - Context API
  - Redux Toolkit
  - Redux-persist
- API 상태관리
  - RTK Query(Redux Toolkit)
- UI
  - Storybook
  - Styled Component
  - Tailwind CSS
  - Module CSS
- 트랜스파일링, 빌드
  - SWC (Babel 대체)
  - Turbo Pack (Webpack 대체)
  - Turbo Repo (Monorepo 빌드)
  - Vite (NPM package 빌드)

## 주요 내부 패키지

- 공통 설정 코드관리
  - config
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

## 모노레포 구조

```javascript
{
  "name": "product",
  "version": "1.0.0",
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

```
monorepo
├─ documents
├─ apps
│  ├─ 애플리케이션1
│  └─ 애플리케이션2
├─ packages
│  ├─ 모듈1
│  └─ 모듈2
└─ ...
```

https://turbo.build/repo  
https://turbo.build/repo/docs/handbook/workspaces  
https://turbo.build/repo/docs/getting-started/create-new  
https://github.com/vercel/turbo/tree/main/examples/basic

## 기능단위 폴더 구조 (Folder / File Structure)

```
[feature or service]
├─ api
├─ components
├─ constant
├─ containers
├─ hocs
├─ hooks
├─ store
├─ styles
├─ types
└─ utils
README.md
```

## 계층간 의존성 제어 (Dependency diagram)

https://www.kimcoder.io/blog/clean-frontend-architecture

도구(ESLint)를 통해, 계층간 의존성 제어를 강제합니다.

layout -> pages -> containers 또는 components -> core  
`의존성은 모두 단방향으로만 흘러가고, 역으로 참조해서는 안 된다.`

core 내부의 코드는 외부(components 또는 pages 등) 코드의 의존성이 없어야 한다.

이러한 관심사의 분리로 인해 각 모듈은 여러 책임에서 벗어나기 쉽고, 테스트하기도 더 쉬워지며, 유지 보수 비용도 줄어들 것이다.

```
 "rules": {
     "import/no-restricted-paths": [
       "error",
       {
         "zones": [
           {
             "target": "src/core",
             "from": "src/components"
           },
           {
             "target": "src/core",
             "from": "src/lib"
           },
           {
             "target": "src/core",
             "from": "src/pages"
           },
           {
             "target": "src/lib",
             "from": "src/pages"
           },
           {
             "target": "src/components",
             "from": "src/pages"
           }
         ]
       }
     ]
   },
   "settings": {
     "import/resolver": {
       "typescript": {
         "project": "."
       }
     }
   }
```

## package.json 에서의 NPM 버전관리

`필히! 중요 모듈은 명확하게 버전을 명시! '^' 등은 사용하지 않음!`

`필히! NPM 내부 패키지를 개발할 경우, 개발하는 패키지가 의존하는 패키지는 package.json 의 "peerDependencies" 항목에 명시!`  
(개발한 패키지가 의존하는 패키지의 명확한 버전을 기입하여, 하용하는 곳에서 동일 의존 패키지의 버전이 다를 경우에 대응)

## ENV

Node.js 기본 환경 구분 'NODE_ENV' 사용 (Next.js 도 동일)

https://nodejs.org/en/learn/getting-started/nodejs-the-difference-between-development-and-production  
https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#environment-variable-load-order

.env  
.env.development.local  
.env.test.local  
.env.production.local  
.env.local

## Node.js TypeScript - tsx

https://www.npmjs.com/package/tsx

Node.js Typescript 코드 변환

`study.git/인프라/서버/NodeJS_NPM/NodeJS_TypeScript.md` 내용 참고

## 빌드

### 터보레포

...

### Vite

...

## Changeset - 모노레포 구성에서 NPM 패키지 배포

Changeset 은 멀티 패키지 환경(monorepo)에서 상호 의존하는 패키지들의 일관성을 유지하기 위한 라이브러리

https://github.com/changesets/changesets

https://turbo.build/repo/docs/handbook/publishing-packages/versioning-and-publishing

https://jinyisland.kr/post/changeset/

```json
{
  "scripts": {
    "publish-packages": "changeset version && changeset publish"
  }
}
```

### 설치

```
$ yarn add @changesets/cli && yarn changeset init
```

### 환경설정

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

### changeset command

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

### version

배포하기로 결정한 후, 다음과 같이 버전 업데이트를 진행  
설정된 업데이트 규칙에 따라 메이저 또는 마이너 버전이 증가하고, 의존하고있는 패키지들도 같이 업데이트  
또한 로그 파일(CHANGELOG.md)도 함께 생성

```
$ yarn changeset version
```

이 단계 이후 changeset publish 명령어를 사용해 내부적으로 .npmrc 파일을 참조해 레지스트리에 배포  
자동 배포를 원하시면 publish를 GitHub Actions에 스크립트를 작성하고 push를 수행

### publish

changeset publish를 실행하면 이전 단계에서 수행한 자동으로 업데이트 예정인 패키지들을 레지스트리에 배포

```
$ yarn changeset publish
```
