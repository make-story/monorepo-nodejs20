# 마이크로 프론트엔드 (Micro Frontend)

`monorepo-nodejs20.git/apps/micro-frontend` 마이크로프론트 제공 (빌드)
`monorepo-nodejs20.git/apps/nextjs14` 마이크로프론트 사용 (import)

`monorepo-nodejs20.git/apps/micro-frontend-purejs` 순수 JavaScript 방식

## Module Federation

https://github.com/module-federation/module-federation-examples/tree/master/nextjs-v13

https://www.npmjs.com/package/@module-federation/nextjs-mf

- checkout - port 3000
- home - port 3001
- shop - port 3002

### @module-federation/nextjs-mf/lib/utils

```javascript
import { injectScript } from '@module-federation/nextjs-mf/lib/utils';
// if i have remotes in my federation plugin, i can pass the name of the remote
injectScript('home').then(remoteContainer => {
  remoteContainer.get('./exposedModule');
});
// if i want to load a custom remote not known at build time.

injectScript({
  global: 'home',
  url: 'http://somthing.com/remoteEntry.js',
}).then(remoteContainer => {
  remoteContainer.get('./exposedModule');
});
```

## 커스텀엘리먼트 + 쉐도우돔 (+ 특점 컴포넌트 빌드 결과물)

```javascript
class CurrentTimeElement extends HTMLElement {
  constructor() {
    // 클래스 초기화. 속성이나 하위 노드는 접근할 수는 없다.
    super();
  }

  // 기본 스팩
  // 커스텀 엘리먼트가 처음 document의 DOM에 연결될 때 호출
  connectedCallback() {
    // DOM에 추가되었다. 렌더링 등의 처리를 하자.
    this.start();
  }

  // 기본 스팩
  // 사용자 정의 요소가 문서의 DOM과 연결되어 있지 않을 때 호출
  disconnectedCallback() {
    // DOM에서 제거되었다. 엘리먼트를 정리하는 일을 하자.
    this.stop();
  }

  // 기본 스팩
  // 속성의 변화를 감시
  // 브라우저는 observedAttributes 배열의 허용 목록에 추가된 모든 속성에 대해 attributeChangedCallback()을 호출
  // 성능 최적화와 관련 높음 (사용자가 style 또는 class와 같은 일반적인 속성을 변경할 때 개발자는 쓸데없이 수많은 콜백을 받는 것을 원치 않음)
  static get observedAttributes() {
    // 모니터링 할 속성 이름
    return ['time'];
  }

  // 기본 스팩
  // 속성의 변화에 반응
  // 사용자 정의 요소의 속성 중 하나가 추가, 제거 또는 변경되면 호출 (observedAttributes 속성에 나열된 특성만 이 콜백을 수신)
  attributeChangedCallback(attrName, oldValue, newValue) {
    //console.log('attributeChangedCallback', attrName);
    // 속성이 추가/제거/변경되었다.
    if (attrName === 'time') {
      this.textContent = newValue;
    }
  }

  // 기본 스팩
  // 사용자 정의 요소를 새 문서로 이동할 때 호출 (해당 엘리먼트가 다른 Document에서 옮겨져 올 때 수행)
  // 사용자설정 요소가 새 document(예: document.adoptNode(el)라고도 함)로 이동된 경우
  adoptedCallback(oldDoc, newDoc) {
    // 다른 Document에서 옮겨져 왔음
    // 자주 쓸 일은 없을 것.
  }

  // 사용자 함수
  start() {
    // 필요에 따라 메서드를 추가할 수 있다.
    // 이 클래스 인스턴스는 HTMLElement이다.
    // 따라서 `document.querySelector('current-time').start()`로 호출할 수 있다.
    this.stop();
    this.timer = window.setInterval(() => {
      this.time = new Date().toLocaleString();
    }, 1000);
  }

  // 사용자 함수
  stop() {
    // 이 메서드 역시 CurrentTime클래스의 필요에 의해 추가했다.
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }

  // getter / setter
  get time() {
    //console.log('get time', this.getAttribute('time'));
    return this.getAttribute('time');
  }
  set time(value) {
    //console.log('set time', value);
    this.setAttribute('time', value);
  }
}

// 요소 정의 (확장/업그레이드)
if (!window.customElements.get('current-time')) {
  window.customElements.define('current-time', CurrentTimeElement); // 정의 (확장/업그레이드)
  window.customElements.whenDefined('current-time').then(() => {
    // 해당 커스텀앨리먼트 모두 적용(요소업데이트/요소확장)완료
    console.log('current-time element ready!');
  });
}

// 이미 등록(요소확장/요소업데이트)된 요소를 또 다시 등록할 경우 DOMException 발생!
//customElements.define("current-time", CurrentTimeElement);

/*
<!-- dynamic import (동적 import) //-->
<!-- static import를 사용하려면, 모든 모듈이 다운로드 된 뒤에 코드가 execution //-->
<!-- https://v8.dev/features/dynamic-import //-->
<script type="module">
// async, await ES8 스펙 (Promise는 ES6 스펙) - async/await는 Promise를 사용
// 동적으로 선언(커스텀엘리먼트 등)에 필요한 리소스(종속된 import 포함)만 동적 로드가 가능
if(document.querySelector('current-time')) {
	(async () => { // async : 함수 내부에서 await 사용한다는 예약어
		let moduleSpecifier = '/javascript/module/current-time.js';
		let module = await import(moduleSpecifier); // await : 비동기 코드실행이 끝난 후 아래 코드 절차(순서)적 실행
		if (!window.customElements.get('current-time')) {
			window.customElements.define('current-time', module.default()); // module.default() : export default 호출
			window.customElements.whenDefined('current-time').then(() => {
				// 해당 커스텀앨리먼트 모두 적용(요소업데이트/요소확장)완료
				console.log('current-time element ready!');
			});
		}
	})();
}
</script>
*/
```
