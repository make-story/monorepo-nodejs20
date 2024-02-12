module.exports = {
  root: true,
  extends: ['next/babel', 'next/core-web-vitals', 'prettier'],
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
              '\n의존성 규칙에 어긋나는 참조입니다. (common 에서 외부 폴더(기능/서비스)를 참조할 수 없습니다.)',
          },
        ],
        zones: [
          {
            target: '**/components/**',
            from: '**/containers/**',
            message:
              '\n의존성 규칙에 어긋나는 참조입니다. (components 에서 containers 를 참조할 수 없습니다.)',
          },
        ],
        zones: [
          {
            target: '**/app/**',
            from: '**/api/**',
            message:
              '\n의존성 규칙에 어긋나는 참조입니다. (app 에서 api 를 참조할 수 없습니다.)',
          },
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: '.',
      },
    },
  },
};
