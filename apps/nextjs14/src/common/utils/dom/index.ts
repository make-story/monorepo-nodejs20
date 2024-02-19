const BODY = 'body';
const HTML = 'html';

export const getElements = (
  selector: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | string,
) => document.querySelectorAll(selector);
export const getElement = (
  selector: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | string,
) => document.querySelector(selector);
export const addClass = (element: Element | null, className: string) =>
  element?.classList.add(className);
export const removeClass = (element: Element | null, className: string) =>
  element?.classList.remove(className);
export const hasClass = (element: Element | null, className: string) =>
  element?.classList.contains(className);
export const getBody = () => getElement(BODY);
export const getHtml = () => getElement(HTML);
export const getRect = (selector: string) =>
  getElement(selector)?.getBoundingClientRect();

// element 위치로 스크롤 이동
export const setScrollTarget = (
  element: HTMLElement | null,
  { moveTop = 0, moveDown = 0 }: { moveTop?: number; moveDown?: number } = {},
) => {
  // 유효성 검사
  if (!element) {
    return;
  }

  // 위치 값
  let top = 0; // 엘리먼트 위치 값
  const rect = element!.getBoundingClientRect(); // offsetTop 과 차이점은 트랜스폼 등 실제 엘리먼트 화면상의 위치 값 반환
  //const header: HTMLElement | null = document.querySelector('header') || null;

  // element 위치값
  top = rect.top;

  // 위로 추가이동
  moveTop += window.scrollY;
  //console.log('moveTop', moveTop);
  if (moveTop) {
    top += moveTop;
  }

  // 아래로 추가이동
  //moveDown += (header && header.getBoundingClientRect().bottom) || 0;
  //console.log('moveDown', moveDown);
  if (moveDown && moveDown < top) {
    top -= moveDown;
  }

  //console.log('rect', rect);
  //console.log('scroll', window.scrollY);
  //console.log('top', top);

  // 스크롤 이동
  if (top) {
    top = Math.ceil(top);
    window.scroll({ top });
  }
};

export const setBodyElemFixed = (addFixed: boolean) => {
  const bodyElem = document.getElementsByTagName('body')?.[0];
  const bodyClassList = bodyElem?.classList;
  const FIXED_CLASS = 'fixedFullLayer'; // 'fixed' 공통 클래스를 사용하지 않은 이유 : FullPageLayer 기능 동작에 따라, FullLayer 제어와 무관하게 해당 클래스 제거될 가능성 있음

  if (addFixed) {
    bodyClassList.add(FIXED_CLASS);
  } else {
    bodyClassList.remove(FIXED_CLASS);
  }
};
