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
 *
 * [주의!] plugin, extend 에 추가되는 것들은 필히! NPM 설치가 되어 있어야 한다!
 */
//const path = require('node:path');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  /*parserOptions: {
    project: ['tsconfig.json'],
  },*/

  // 프로젝트에 자바스크립트 파일과 타입스크립트 파일이 공존한다면 자바스크립트 파일을 기준으로 기본 설정을 하고,
  // 타입스크립트 파일을 위한 설정은 overrides 옵션에 명시할 수 있습니다.
  /*overrides: [
    {
      files: ['*.ts', '*.tsx', '*.js'],
      parser: '@typescript-eslint/parser',
    },
  ],*/

  // 플러그인은 일련의 규칙(rules) 집합이며, 플러그인을 추가하여도 규칙(rules)은 적용되지 않습니다.
  // (규칙을 적용하기 위해서는 추가한 플러그인 중, 사용할 규칙을 rules 에 추가해주어야 적용이 됩니다.)
  plugins: ['import'],

  // 패키지들이나 룰들을 모아서 설정으로 만든 것
  // eslint-plugin-* 패키지의 설정은 extends 에서 plugin:패키지네임/설정네임으로 사용할 수 있는데
  // eslint-config-* 패키지의 설정은 바로 '*' (예를 들어, 'eslint-config-prettier' 의 경우 'prettier' 만 입력)를 써주기만 하면 된다.
  extends: [
    'next/core-web-vitals',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],

  // 직접 lint rule 을 적용하는 부분
  // extends 로 자동으로 설정된 rules 중에, 특정 rule을 끄거나, erorr를 warning으로 나오도록 변경하는 등 설정을 바꿀 수 있다.
  rules: {
    'import/default': 'warn',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling'],
          'index',
        ],
        pathGroups: [
          {
            pattern: '#/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/**',
            group: 'external',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
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
        // "zones" 가 여러개 있을 경우, Lint 가 작동안함, 사용예: zones: [ ...규칙 여러개 작성 ]
        zones: [
          {
            target: '**/common/**',
            from: '**/*',
            except: [
              '**/node_modules/**',
              '**/packages/**',
              '**/common/**',
              '**/src/store.*',
            ],
            message:
              '\n의존성 규칙에 어긋나는 참조입니다. - common 에서 외부 폴더(기능/서비스)를 참조할 수 없습니다.',
          },
          {
            target: '**/components/**',
            from: '**/containers/**',
            message:
              '\n의존성 규칙에 어긋나는 참조입니다. - components 에서 containers 를 참조할 수 없습니다. (container 하위에 component 가 존재해야 합니다.)',
          },
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

  // 일부 ESLint 플러그인은 추가적인 설정이 가능
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        // tsconfig.json 에 paths 설정(예: "@/*": ["./src/*"])이 있을 경우, 아래 설정 필수
        project: ['**/tsconfig.json'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      //caseSensitive: false,
    },
  },
};
