# TypeScript 설정, ESLint 설정 등 프로젝트별 공통 관리

Nex.js + Turborepo (Next.js 공식예제) - 24년 01월 기준

https://github.com/vercel/turbo/tree/main/examples/basic

# 사용 예

사용하는 곳에서 package.json

```json
{
  "name": "web",
  "version": "1.0.0",
  "private": true,
  "devDependencies": {
    "@ysm/config": "workspace:*"
  }
}
```

사용하는 곳에서 tsconfig.json

```json
{
  "extends": "@ysm/config/tsconfig.base.json",
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
  extends: ['@ysm/config/eslint.nextjs.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
};
```
