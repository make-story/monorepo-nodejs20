# 재사용 컴포넌트 (디자인시스템)

> 특정버전 호환이 필요한 의존성 모듈은 package.json 에 peerDependencies 항목에도 의존성 패키지 및 버전 명시 필수!

`패키지를 사용하는 쪽에 현재 패키지가 의존하는 라이브러리 버전 설치 필수라는 것 명시!`  
`실제로 패키지에서 직접 require(import) 하지는 않더라도 호환성이 필요한 경우 명시!`

## 디자인시스템의 원칙 (By Katie Sylor-Miller, Design Systems Handbook 저자 중 한명)

- It is consistent - 일관성
  컴포넌트를 빌드하고 관리하는 방식이 예측 가능한 패턴을 따라야 합니다.
- It is self-contained - 독립적
  디자인 시스템은 독립적인 변수로 취급합니다.
- It is reusable - 재사용 가능성
  여러 상황에서 재사용할 수 있도록 컴포넌트를 제작합니다.
- It is accessible - 접근성
  디자인 시스템으로 구축된 애플리케이션은 웹에 액세스하는 방식과 관계없이 최대한 많은 사람들이 사용할 수 있습니다.
- It is robust - 견고함
  디자인 시스템이 적용되는 제품이나 플랫폼에 관계없이 버그를 최소화하면서 원활하게 작동해야 합니다.

## 아토믹 디자인

https://bradfrost.com/blog/post/atomic-web-design

Atoms(원자), Molecules(분자), Organism(유기체), Templetes, Page

## 나누는 기준의 주관성

기존의 아토믹 디자인은 컴포넌트 분리를 세분화 시키다보니  
초기 설계를 잘못하다보면 분리 기준이 모호한 컴포넌트가 발생하며  
재사용성이라는 처음의 도입 목적과 다르게 원래의 코드로 돌아갈 가능성이 있다.

https://www.slideshare.net/NaverEngineering/line-entry-atomic-design

https://www.youtube.com/watch?v=33yj-Q5v8mQ

https://maeng2418.github.io/react/atomic_design/

https://fe-developers.kakaoent.com/2022/220505-how-page-part-use-atomic-design-system/

## 컴포넌트 분리기준

아토믹 디자인을 기반 했으나, 구성 요소 분리 기준의 모호함에 따라,  
'Dennis Reiman' 의 'Atomic Design is messy, here’s what I prefer' 글 내용 참고하여 재정의

- elements (atom)
  - 예: TestButton, TestIcon
- modules (molecules, organism)
  - 예: TestSection, TestAside, TestArticle
- templates
  - 예: TestPage
- layouts (page)
  - 예: BaseLayout
