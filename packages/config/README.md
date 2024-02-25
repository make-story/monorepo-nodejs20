# TypeScript 설정, ESLint 설정 등 프로젝트별 공통 Config 관리

Nex.js + Turborepo (Next.js 공식예제) - 24년 01월 기준

https://github.com/vercel/turbo/tree/main/examples/basic

## 사용 예

사용하는 곳에서 package.json

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

사용하는 곳에서 tsconfig.json

```json
{
  "extends": "@makestory/config/tsconfig.base.json",
  "compilerOptions": {},
  "include": [
    "next-env.d.ts",
    "next.config.js",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

사용하는 곳에서 .eslintrc.js

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

### tsconfig.cli.json

ts 파일 실행

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

### tsconfig.server.json

ts 파일로 작업된 서버실행 파일 컴파일 또는 실행

참고  
https://playwright.dev/docs/test-typescript#manually-compile-tests-with-typescript

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
