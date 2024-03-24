/**
 * https://eslint.org/docs/latest/use/getting-started#configuration
 * https://eslint.org/docs/latest/rules/
 *
 * $ yarn add eslint
 *
 * ESLint 와 Prettier 충돌 해결
 * https://prettier.io/docs/en/integrating-with-linters.html
 * eslint-config-prettier : eslint 에서 prettier 와 겹치는 포매팅룰을 삭제합니다.
 * eslint-plugin-prettier : eslint 에 prettier 의 포매팅 기능을 추가합니다.
 * eslint-config-prettier 로 eslint의 원래 포매팅 기능을 없애버리고, eslint-plugin-prettier 로 prettier의 포매팅 기능을 사용합니다.
 *
 * 'eslint-config-next' 포함된 패키지
 * https://github.com/vercel/next.js/blob/canary/packages/eslint-config-next/package.json
 * eslint, typescript
 * @typescript-eslint/parser
 * eslint-import-resolver-node, eslint-import-resolver-typescript, eslint-plugin-import
 * eslint-plugin-jsx-a11y, eslint-plugin-react, eslint-plugin-react-hooks
 */
//const path = require('node:path');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  /*parserOptions: {
    project: ['tsconfig.json'],
  },*/
  plugins: ['import'],
  extends: [
    'next/core-web-vitals',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling'],
          'index',
        ],
        'newlines-between': 'always',
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'react', // import React from 'react'; 방지 - React 17 이상에서는 기본적으로 JSX 에서 React 를 import하지 않아도 됩니다.
            importNames: ['default'],
            message: "import React from 'react' makes bundle size larger.",
          },
        ],
        //patterns: ['.*'], // 상대경로 방지
      },
    ],
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: '**/common/**',
            from: '**/*',
            except: ['**/node_modules/**', '**/common/**', '**/src/store.*'],
            message:
              '\n의존성 규칙에 어긋나는 참조입니다. - common 에서 외부 폴더(기능/서비스)를 참조할 수 없습니다.',
          },
        ],
        zones: [
          {
            target: '**/components/**',
            from: '**/containers/**',
            message:
              '\n의존성 규칙에 어긋나는 참조입니다. - components 에서 containers 를 참조할 수 없습니다. (container 하위에 component 가 존재해야 합니다.)',
          },
        ],
        zones: [
          {
            target: '**/app/**',
            from: '**/api/**',
            message:
              '\n의존성 규칙에 어긋나는 참조입니다. - app 에서 api 를 직접 참조할 수 없습니다. (추상화된 함수 또는 사용자훅을 통해 사용 가능합니다.)',
          },
        ],
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: '**/tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      //caseSensitive: false,
    },
  },
};
