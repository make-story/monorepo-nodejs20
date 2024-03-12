'use client';

import {
  PropsWithChildren,
  useState,
  useEffect,
  useRef,
  useCallback,
  ComponentProps,
} from 'react';
//import WebSocket from 'ws';

const TestCaseRun = (props: PropsWithChildren) => {
  const isHeadlessControl = useRef(false);
  const socket = useRef(null);
  const [dropdownOpen, setRunButtonOpen] = useState(false);

  const onStart = useCallback(() => {
    //resetState();
    //socket.open(`${socketUrl}/uitest/${device}/${testcase}?headless=${isHeadless}`);
  }, []);

  const onRunToggle = useCallback(
    (event: any) => {
      const value = event.target.value;
      const text = event.target.textContent;

      // 버튼 열림
      setRunButtonOpen(!dropdownOpen);

      // 작업 분기처리
      if (value === 'start') {
        onStart();
        //setRunButtonValue(value);
        //setRunButtonText(text);
      } else if (/^\d+(second|minute|hour|day)$/i.test(value)) {
        //setRunButtonValue(value);
        //setRunButtonText(text);
      }
    },
    [dropdownOpen],
  );
  const onStop = useCallback((event: any) => {
    //socket.close();
    //setRunButtonValue("");
    //setRunButtonText("Run");
  }, []);

  useEffect(() => {
    // Headless 사용가능 환경 여부
    isHeadlessControl.current = ['localhost', '127.0.0.1'].includes(
      window.location.hostname,
    );
    //socket.current = websocket(null, { reconnect: { auto: false } });
  }, []);

  /*useEffect(() => {
    socket.listeners.open = () => {
      setRunToggle(true);
    };
    socket.listeners.close = () => {
      setRunToggle(false);
    };
    socket.listeners.message = data => {
      const { type, log, value = {} } = JSON.parse(data) || {};
      switch (type) {
        case 'request':
          setRequestList(oldArray => [value, ...oldArray]);
          //setRequestTypeDispatch({ type: value.resourceType, value })
          break;
        case 'requestfailed':
          setRequestfailedList(oldArray => [value, ...oldArray]);
          break;
        case 'requestfinished':
          //setRequestfinishedList(oldArray => [value, ...oldArray, ]);
          break;
        case 'response':
          setResponseList(oldArray => [value, ...oldArray]);
          if (400 <= value.status && value.status < 600) {
            setRequestfailedList(oldArray => [value, ...oldArray]);
          }
          break;
        case 'error':
          setErrorList(oldArray => [value, ...oldArray]);
          break;
        case 'pageerror':
          setPageerrorList(oldArray => [value, ...oldArray]);
          break;
        case 'console':
          setConsoleList(oldArray => [value, ...oldArray]);
          break;
      }
    };
    return () => {
      // 웹소켓 종료
      socket.close();
    };
  }, []);*/

  useEffect(() => {
    // WebSocket 서버 주소
    const socket = new WebSocket(
      `ws://localhost:9030/uitest/mobile/product/temp?headless=true&timestamp=${Date.now()}`,
    );

    // 연결이 열렸을 때의 이벤트 핸들러
    socket.addEventListener('open', event => {
      console.log('WebSocket 연결이 열렸습니다.', event);

      // 메시지 전송 예제
      socket.send('안녕하세요, WebSocket!');
    });

    // 메시지를 수신했을 때의 이벤트 핸들러
    socket.addEventListener('message', event => {
      console.log('서버로부터 메시지 수신:', event.data);
    });

    // 연결이 닫혔을 때의 이벤트 핸들러
    socket.addEventListener('close', event => {
      console.log('WebSocket 연결이 닫혔습니다.', event);
    });

    // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <button onClick={onStop}>Button</button>
    </>
  );
};

export default TestCaseRun;
