# Hygen

Hygen 은 CLI 를 이용하여 미리 만들어둔 템플릿을 원하는 위치에 원하는 형식으로 생성해주는 도구입니다.

https://www.hygen.io/

Hygen 은 CLI 상호작용을 도와주는 Enquirer 도구(라이브러리)를 내장

## 설치

```bash
$ yarn global add hygen
# 또는
$ npm i -g hygen
```

## 기본적 명령 구조

```bash
$ hygen <generator> <action> [name]
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
$ hygen [생성하고 싶은 템플릿 명] new
```
