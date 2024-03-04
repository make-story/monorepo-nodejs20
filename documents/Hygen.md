# Hygen

Hygen 은 CLI 를 이용하여 미리 만들어둔 템플릿을 원하는 위치에 원하는 형식으로 생성해주는 도구입니다.  
https://www.hygen.io/

Hygen 은 CLI 상호작용을 도와주는 Enquirer 도구(라이브러리)를 내장  
https://github.com/enquirer/enquirer#prompt-options

참고: nodejs prompt  
https://cto.ai/blog/node-ux-prompts/

## 설치

```bash
$ yarn global add hygen
# 또는
$ npm i -g hygen
```

## 기본적 명령 구조

```bash
$ hygen <generator> <action> <name>
```

- generator, init 이 hygen 명령어의 generator
- generator/help, new, with-prompt, init/repo 가 action

## 초기설정 구성

root 경로에 \_templates 폴더가 생성

```bash
$ hygen init self
```

## 템플릿 생성

```bash
$ hygen generator new [생성하고 싶은 템플릿 명]
$ hygen [생성된 템플릿 명] new [name]
```

### 예제

```bash
$ hygen generator new awesome-generator
# _template/awesome-generator/new/hello.ejs.t 생성됨
```

\_templates/awesome-generator/new/hello.ejs.t

````javascript
---
to: app/hello.js
---
const hello = ```
Hello!
This is your first hygen template.

Learn what it can do here:

https://github.com/jondot/hygen
```

console.log(hello)

````

```bash
$ hygen awesome-generator new hello
# app/hello.js 생성됨
```

## 입력 상호작용 추가 - CLI

프롬프트는 제너레이터 폴더 루트에 prompt.js 라는 이름으로 생성  
prompt.js 는 예약어처럼 미리 등록된 파일 이름으로,  
생성 후 별도로 import하거나 설정해주는 등의 동작을 필요로 하지 않습니다.

\_templates/app/new/prompt.js

```javascript
// $ hygen app new hello
module.exports = {
  prompt: async ({ prompter, args }) => {
    const { path1 } = await prompter.prompt({
      type: 'input',
      name: 'path1',
      message: 'Path1의 값을 입력해주세요.',
    });
    const { path2 } = await prompter.prompt({
      type: 'input',
      name: 'path2',
      message: 'Path2의 값을 입력해주세요.',
    });
    const category = await prompter.select({
      type: 'input',
      name: 'category',
      message: '카테고리 컴포넌트의 카테고리를 선택하세요.',
      choices: ['animation', 'common', 'core', 'util'],
    });

    console.log('category', category);

    if (!path1)
      throw new Error('path1의 값이 비어있습니다. path1 의 값을 입력해주세요');
    if (!path2)
      throw new Error('path2의 값이 비어있습니다. path1 의 값을 입력해주세요');

    return {
      path1,
      path2,
      category,
      args,
    };
  },
};
```
