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
- Yarn 안정화버전
- Next.js 14.0.3
- TypeScript 5.x

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
[service] (기능단위/서비스단위)
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
