> 특정버전 호환이 필요한 의존성 모듈은 package.json 에 peerDependencies 항목에도 의존성 패키지 및 버전 명시 필수!

`패키지를 사용하는 쪽에 현재 패키지가 의존하는 라이브러리 버전 설치 필수라는 것 명시!`  
`실제로 패키지에서 직접 require(import) 하지는 않더라도 호환성이 필요한 경우 명시!`

# 배포 시 번들링 과정이 필요한 이유

https://ko.vitejs.dev/guide/why.html#why-bundle-for-production

# 커멘드라인

```json
{
  "scripts": {
    "dev": "vite", // 개발 서버를 실행합니다. (`vite dev` 또는 `vite serve`로도 시작이 가능합니다.)
    "build": "vite build", // 배포용 빌드 작업을 수행합니다.
    "preview": "vite preview" // 로컬에서 배포용 빌드에 대한 프리뷰 서버를 실행합니다.
  }
}
```
