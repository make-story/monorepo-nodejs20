/**
 * Express Server <-> WebSocket
 * https://github.com/websockets/ws/blob/HEAD/doc/ws.md
 */
import WebSocket, { WebSocketType, WebSocketServer } from 'ws'; // https://www.npmjs.com/package/ws#external-https-server
import * as http from 'http';
export { type WebSocketType };

interface MiddlewareOptions {}
type MessageCallback = (message?: string) => void;
type ConnectionCallback = (ws?: WebSocketType) => void;
type OpenCallback = () => void;
type CloseCallback = () => void;
interface CallbackMap {
  message?: MessageCallback;
  connection?: ConnectionCallback;
  open?: OpenCallback;
  close?: CloseCallback;
}

// interface key 리스트를 타입으로 변환
type KeysOf<T> = {
  [K in keyof T]: K;
}[keyof T];

// interface value 리스트를 타입으로 변환
type ValuesOf<T> = T[keyof T];

// 전역 이벤트
export const EVENT_TYPE: { [key: string]: KeysOf<CallbackMap> } = {
  OPEN: 'open',
  CLOSE: 'close',
  MESSAGE: 'message',
  CONNECTION: 'connection',
};

class WebSocketMiddleware {
  private wss: WebSocket.Server;
  private callbacks: Map<KeysOf<CallbackMap>, Set<ValuesOf<CallbackMap>>> =
    new Map();
  private interval: ReturnType<typeof setTimeout> | null = null;

  constructor(server: http.Server, {}: MiddlewareOptions = {}) {
    this.wss = new WebSocket.Server({ server });
    this.setup();
  }

  private handleListening() {
    //console.log('WebSocketMiddleware > handleListening');
    this.trigger(EVENT_TYPE.OPEN);
  }

  private handleConnection(ws: WebSocketType, request?: http.IncomingMessage) {
    //console.log('WebSocketMiddleware > handleConnection');
    ws.isAlive = true;
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-open
    ws.on('open', () => {
      // ...
    });
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-message
    ws.on('message', (message: WebSocket.RawData, isBinary: boolean) => {
      this.handleClientMessage(message, isBinary, ws);
    });
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-pong
    ws.on('pong', (data: Buffer) => {
      this.handlePong(data, ws);
    });
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-close-1
    ws.on('close', (code: number, reason: Buffer) => {
      this.handleClose(code, reason);
    });
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-error-1
    ws.on('error', console.error);
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-unexpected-response
    ws.on(
      'unexpected-response',
      (request: http.ClientRequest, response: http.IncomingMessage) => {
        // ...
      },
    );
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-upgrade
    ws.on('upgrade', (response: http.IncomingMessage) => {
      // ...
    });
  }

  private handleServerMessage(message: WebSocket.RawData, isBinary: boolean) {
    //console.log('WebSocketMiddleware > handleServerMessage', message, isBinary);
  }
  private handleClientMessage(
    message: WebSocket.RawData,
    isBinary: boolean,
    ws: WebSocket,
  ) {
    //console.log('WebSocketMiddleware > handleClientMessage', message, isBinary, ws);
    this.trigger(EVENT_TYPE.MESSAGE, { message, isBinary, ws });

    // Broadcast the message to all connected clients
    this.wss.clients.forEach(client => {
      if (/*client !== ws && */ client.readyState === WebSocket.OPEN) {
        (client as WebSocket).send(message);
      }
    });
  }

  private handlePong(data: Buffer, ws: WebSocketType) {
    console.log('WebSocketMiddleware > handlePong', data);
    ws.isAlive = true;
  }

  private handleClose(code: number, reason: Buffer) {
    console.log('WebSocketMiddleware > handleClose', code, reason);
    this.interval && clearInterval(this.interval);
  }

  private closedConnectionDetection() {
    // 비정상 종료된 연결 감시
    const checkClients = () => {
      console.log(
        'WebSocketMiddleware > closedConnectionDetection',
        this.wss.clients.size,
      );
      this.wss.clients?.forEach((ws: any) => {
        //console.log('isAlive', ws.isAlive);
        if (ws.isAlive === false) {
          console.log('WebSocketMiddleware > terminate');
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    };
    this.interval = setInterval(checkClients, 30000);
  }

  private setup() {
    // 소켓 연결
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-listening
    this.wss.on('listening', () => {
      this.handleListening();
    });
    // 신규 클라이언트 연결
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-connection
    this.wss.on(
      'connection',
      (ws: WebSocketType, request: http.IncomingMessage) => {
        this.handleConnection(ws, request);
        this.trigger(EVENT_TYPE.CONNECTION, { ws, request });
      },
    );
    // 연결 종료
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-close
    this.wss.on('close', (code: number, reason: Buffer) => {
      this.handleClose(code, reason);
      this.trigger(EVENT_TYPE.CLOSE);
    });
    // WebSocket 연결이 설정되기 전에 오류가 발생
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-wsclienterror
    this.wss.on('wsClientError', (error, socket, request) => {
      console.error(error);
    });
    // 에러
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-error
    this.wss.on('error', error => {
      console.error(error);
    });
    // 연결 감시
    this.closedConnectionDetection();
  }

  public close(ws?: WebSocket) {
    // 소켓 연결 종료
    console.log('WebSocketMiddleware > close');
    this.wss.clients.forEach((client: WebSocket) => {
      if (!ws || (!!ws && client === ws)) {
        client.terminate();
        client.ping();
      }
    });
    !ws && this.wss.close(() => {});
  }

  public on(event: KeysOf<CallbackMap>, callback: ValuesOf<CallbackMap>) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, new Set());
    }
    this.callbacks.get(event)?.add(callback);
  }

  public off(event: KeysOf<CallbackMap>, callback: ValuesOf<CallbackMap>) {
    const eventCallbacks = this.callbacks.get(event);
    if (eventCallbacks) {
      eventCallbacks.delete(callback);
    }
  }

  private trigger(event: KeysOf<CallbackMap>, ...args: any[]) {
    const eventCallbacks = this.callbacks.get(event);
    if (eventCallbacks) {
      eventCallbacks.forEach((callback: any) => callback(...args));
    }
  }

  public use(routePath: string, request: http.IncomingMessage, handler: any) {
    // 라우팅 감지 -> 해당 라우트에 해당할 경우 handler 실행
    const {
      complete,
      socket, // Socket
      headers, // IncomingHttpHeaders
      method, // HTTP Method
      url, // 예: /testcase/home?test=true
      statusCode,
      statusMessage,
    } = request;
  }
}

export default WebSocketMiddleware;
