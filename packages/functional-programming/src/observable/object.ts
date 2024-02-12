/**
 * 프락시를 반환해 ‘객체를 observable 하게 만들어주는’ 함수
 * https://ko.javascript.info/task/observable
 */
export interface Observable {
  observe(handler: Function): void;
}

export function makeObservable<T extends object>(target: T): T & Observable {
  const handlers = Symbol('handlers');

  // 핸들러를 저장할 곳을 초기화합니다.
  (target as any)[handlers] = [];

  // 나중에 호출될 것을 대비하여 핸들러 함수를 배열에 저장합니다.
  (target as Observable).observe = function (handler: Function) {
    (this as any)[handlers].push(handler);
  };

  // 변경을 처리할 프락시를 만듭니다.
  return new Proxy(target, {
    set(target, property, value, receiver) {
      let success = Reflect.set(target, property, value, receiver); // 동작을 객체에 전달합니다.
      if (success) {
        // 에러 없이 프로퍼티를 제대로 설정했으면
        // 모든 핸들러를 호출합니다.
        (target as any)[handlers].forEach((handler: Function) =>
          handler(property, value),
        );
      }
      return success;
    },
  }) as T & Observable;
}

// 예제 사용
let user: { [key: string]: any } = {};
user = makeObservable(user);
user.observe((key: string, value: any) => {
  alert(`SET ${key}=${value}`);
});
user.name = 'John';
