# TypeScript 설정, ESLint 설정 등 프로젝트별 공통 Config 관리

Nex.js + Turborepo (Next.js 공식예제) - 24년 01월 기준

https://github.com/vercel/turbo/tree/main/examples/basic

## .eslintrc.js

```javascript
/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@makestory/config/eslint.nextjs.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
};
```

## tsconfig.\*

### tsconfig.base.json

tsconfig.json 기본 공통설정

사용 예

```json
{
  "extends": "@makestory/config/tsconfig.base.json",
  "compilerOptions": {
    "paths": {
      "#/*": ["./*"], // root
      "@/*": ["./src/*"] // src
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "**/*.d.ts",
    ".next/types/**/*.ts",
    "next.config.js"
  ],
  "exclude": ["node_modules"]
}
```

package.json

```json
{
  "name": "web",
  "version": "1.0.0",
  "private": true,
  "devDependencies": {
    "@makestory/config": "workspace:*"
  }
}
```

### tsconfig.cli.json

ts 파일 실행

사용 예

package.json

```json
{
  "scripts": {
    "ts-node": "ts-node --project tsconfig.cli.json"
  }
}
```

test.ts 파일 실행

```bash
$ yarn ts-node test.ts
```

### tsconfig.package.json

NPM packages 컴피일

아래 두 설정 필수!

- "outDir": "dist", // 컴파일 결과 디렉토리 설정
- "declaration": true, // d.ts 파일 생성

사용 예

```json
{
  "extends": "@makestory/config/tsconfig.package.json",
  "compilerOptions": {},
  "exclude": ["node_modules", "public"],
  "include": ["**/*.ts", "**/*.tsx", "**/*.d.ts", "**/*.js"]
}
```

### tsconfig.server.json

ts 파일로 작업된 서버실행 파일 컴파일 또는 실행

참고  
https://playwright.dev/docs/test-typescript#manually-compile-tests-with-typescript

사용 예

```json
{
  "extends": "@makestory/config/tsconfig.server.json",
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "./_dist", // 사용하는 곳 기준 경로로 설정되도록 함
    "paths": {
      "#/*": ["./*"], // root
      "@/*": ["./src/*"] // src
    }
  },
  "include": ["**/*.ts", "**/*.tsx", "**/*.d.ts", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

package.json

```json
{
  "scripts": {
    "dev:server": "NODE_OPTIONS='--inspect' NODE_ENV=${NODE_ENV:=development} PORT=9040 PORT_SSL=443 ts-node --project tsconfig.server.json server.ts",
    "build:server": "tsc --project tsconfig.server.json",
    "start:server:dev": "NODE_ENV=development node _dist/server.js"
  }
}
```
