# 모노레포

Next.js 14 개발환경 템플릿 테스트

```bash
# 의존성 NPM 모듈 설치 및 모노레포 세팅
$ yarn
# 트랜스파일링 및 빌드
$ turbo:build
# 서버 실행
$ yarn nextjs14 start
```

로컬환경 실행

```bash
# Next.js 일반 개발환경 실행
$ yarn nextjs14 dev
# Next.js 일반 개발환경 터보팩으로 실행
$ yarn nextjs14 dev:turbo
```

스토리북(로컬환경) 실행

```bash
$ yarn storybook dev
```

## 버전

- Node.js 20 이상 (20.10.0)
- Next.js 14.0.3

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
product
├─ documents
├─ apps
│  ├─ 애플리케이션1
│  └─ 애플리케이션2
├─ packages
│  ├─ 모듈1
│  └─ 모듈2
└─ ...
```

## 기능단위 폴더 구조 (Folder / File Structure)

```
service
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

pages -> components 또는 lib -> core  
`의존성은 모두 단방향으로만 흘러가고, 역으로 참조해서는 안 된다.`

core 내부의 코드는 외부(components 또는 lib 또는 pages 등) 코드의 의존성이 없어야 한다. (캡슐화)

## package.json 에서의 NPM 버전관리

`필히! 중요 모듈은 명확하게 버전을 명시! '^' 등은 사용하지 않음!`

`필히! NPM 내부 패키지를 개발할 경우, 개발하는 패키지가 의존하는 패키지는 package.json 의 "peerDependencies" 항목에 명시!`  
(개발한 패키지가 의존하는 패키지의 명확한 버전을 기입하여, 하용하는 곳에서 동일 의존 패키지의 버전이 다를 경우에 대응)

## ENV

.env  
.env.development.local  
.env.test.local  
.env.production.local  
.env.local
