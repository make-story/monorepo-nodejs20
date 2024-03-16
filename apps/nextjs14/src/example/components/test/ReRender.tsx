/**
 * 리렌더링
 * - state 가 바뀌었을 때
 * - props 가 바뀌었을 때
 * - 부모 컴포넌트가 렌더링 었을 때 하위 컴포넌트의 경우 (자식 컴포넌트란 부모 컴포넌트의 JSX 안에 사용된 모든 컴포넌트들)
 *    - <Parent><Child><Child></Child></Child></Parent> Parent 가 부모, Child 가 하위 컴포넌트
 */
import { memo, useState, useCallback, PropsWithChildren } from 'react';

const ChildComponent = () => {
  console.log('ChildComponent is rendering!');
  return <div>Hello World! - ChildComponent</div>;
};
const ChildComponentMemo = memo(ChildComponent);

const ChildComponentProps = ({
  onClick,
}: PropsWithChildren<{ onClick: any }>) => {
  console.log('ChildComponent is rendering!', onClick);
  return <div>Hello World! - ChildComponentProps</div>;
};
const ChildComponentPropsMemo = memo(ChildComponentProps);

const ParentComponent = () => {
  console.log('ParentComponent is rendering!');
  const [toggle, setToggle] = useState(false);

  return (
    <div>
      {/* React.memo 사용하여 리렌더 방지 */}
      <ChildComponentMemo />
      <button
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        ParentComponent
      </button>
    </div>
  );
};

const ParentComponentChildren = ({ children }: PropsWithChildren) => {
  console.log('ParentComponent is rendering!');
  const [toggle, setToggle] = useState(false);

  return (
    <div>
      {/* React 컴포넌트를 children 로 받아 리렌더 방지 */}
      {children}
      <button
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        ParentComponentChildren
      </button>
    </div>
  );
};

const ParentComponentChildComponentProps = () => {
  console.log('ParentComponent is rendering!');
  const [toggle, setToggle] = useState(false);
  const onClick = useCallback(() => {
    console.log('Click!!!');
  }, []);

  return (
    <div>
      {/*<ChildComponentPropsMemo onClick={() => console.log('Click!!!')} />*/}
      {/* useCallback 사용하여 리렌더 방지!!!!! */}
      <ChildComponentPropsMemo onClick={onClick} />
      <button
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        ParentComponentChildComponentProps
      </button>
    </div>
  );
};

const ParentComponentValue = ({
  value,
}: PropsWithChildren<{ value: number }>) => {
  const [toggle, setToggle] = useState(false);

  // 현재 컴포넌트가 리렌터될 때 마다, props 로 받은 value 값이 변할 것인가??
  console.log(value);

  return (
    <div>
      <button
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        ParentComponentValue
      </button>
    </div>
  );
};

const ReRender = ({ test }: any) => {
  console.log(test);
  const randomNumber = () => {
    return Math.random();
  };

  return (
    <>
      <div>
        <h1>React.memo 활용 리렌더 방지</h1>
        <ParentComponent />
        <h1>children 활용 리렌더 방지</h1>
        <ParentComponentChildren>
          <ChildComponent />
        </ParentComponentChildren>
        <h1>리렌더할 때 Porps 로 넘기는 값이 변하는지 여부</h1>
        <ParentComponentValue value={randomNumber()} />
        <h1>React.memo 활용 props 값 리렌더 방지</h1>
        <ParentComponentChildComponentProps />
      </div>
    </>
  );
};

export default ReRender;
