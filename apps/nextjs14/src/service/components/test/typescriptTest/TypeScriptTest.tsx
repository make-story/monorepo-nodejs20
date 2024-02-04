/**
 * 제네릭
 * 제네릭 타입 한정
 * 제네릭 기본 타입
 *
 * 타입 조건문
 */
import { ReactElement } from 'react';

/**
 * 기본적인 제네릭
 */
interface Person<N = string, A = number> {
  type: string;
  name: N;
  age: A;
}
/*
1. 어떤 이벤트일지 정해지지 않았으니 제네릭 타입을 사용한다.
type MyEvent<T> = {
    target: T
    type: string
}

2. 그리고 이렇게 HTML Button인것을 알면 지정해준다. 여기서 target은 제네릭타입이니 'HTMLButton Element'의 타입을 받는다.
let buttonEvent: MyEvent<HTMLButtonElement> = {
    target: myButton,
    type: string
}

3. 특정 요소 타입을 알 수 없을 때를 생각하여 이렇게 기본값을 주는 방법이 있다!
type MyEvent<T = HTMLElement> = {
    target: T
    type: string
}

4. extends를 붙이면 T가 HTML 요소로 한정이 된다. 이렇게 되면 T의 타입은 HTML Element거나 HTML Element의 서브타입이다.
type MyEvent<T extends HTMLElement = HTMLElement> = {
    target: T
    type: string
}

5. 그러면 아까 2번처럼 HTMLElement를 수동적으로 명시해주지 않아도 된다. 오예!
let myEvent: MyEvent = {
    target: myElement,
    type: string
}
*/

/**
 * 인터섹션 타입(Intersection Type)은 여러 타입을 모두 만족하는 하나의 타입을 의미
 * 조건문과 비슷한 컨디셔널 타입
 */
type A1 = string;
type B1 = A1 extends string ? number : boolean; // A1 타입이 string 경우, type B1 = number;

/**
 * 2개 이상의 타입을 조합
 */
interface IUser {
  name: string;
  age: number;
}
interface IValidation {
  isValid: boolean;
}

const TypeScriptTest = (): ReactElement => {
  const test1: Person<number, string> = {
    type: 'test',
    name: 123,
    age: '23세',
  };
  const test2: B1 = 123;
  const test3: IUser & IValidation = {
    name: 'Neo',
    age: 85,
    isValid: true,
  };

  return <>TypeScriptTest</>;
};

export default TypeScriptTest;
