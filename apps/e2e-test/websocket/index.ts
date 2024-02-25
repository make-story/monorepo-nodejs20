/**
 * Express Server <-> WebSocket
 * https://github.com/websockets/ws/blob/HEAD/doc/ws.md
 */
import * as http from 'node:http';
import WebSocket, { WebSocketType, WebSocketServer } from 'ws'; // https://www.npmjs.com/package/ws#external-https-server
import createPathMatch from 'path-match';
import { MiddlewareOptions, CallbackMap, KeysOf, ValuesOf } from './type';

export { type WebSocketType };

const pathMatch = createPathMatch({
  sensitive: false,
  strict: false,
  end: false,
});

// 전역 이벤트
export const EVENT_TYPE: { [key: string]: KeysOf<CallbackMap> } = {
  LISTENING: 'listening',
  CONNECTION: 'connection',
  MESSAGE: 'message',
  CLOSE_SOCKET: 'closeSocket',
  CLOSE_CLIENT: 'closeClient',
  ERROR_SOCKET: 'errorSocket',
  ERROR_CLIENT: 'errorClient',
};

class WebSocketMiddleware {
  private wss: WebSocket.Server; // wss: WebSocketServer, ws: WebSocket
  private callbacks: Map<KeysOf<CallbackMap>, Set<ValuesOf<CallbackMap>>> =
    new Map();
  private routes: Map<string, Set<Function>> = new Map();
  private interval: ReturnType<typeof setTimeout> | null = null;

  constructor(server: http.Server, {}: MiddlewareOptions = {}) {
    this.wss = new WebSocket.Server({ server });
    this.setupSocket();
  }

  private setupClient(ws: WebSocketType, request: http.IncomingMessage) {
    //console.log('WebSocketMiddleware > setupClient');

    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-message
    ws.on('message', (message: WebSocket.RawData, isBinary: boolean) => {
      // TEST: Broadcast - 자신은 제외하고 발송
      this.wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          (client as WebSocket).send(message);
        }
      });
      this.triggerEvent(EVENT_TYPE.MESSAGE, { message, isBinary, ws, request });
    });

    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-pong
    ws.on('pong', (data: Buffer) => {
      ws.isAlive = true;
    });

    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-close-1
    ws.on('close', (code: number, reason: Buffer) => {
      console.log(EVENT_TYPE.CLOSE_CLIENT, code);
      this.close(ws);
      this.triggerEvent(EVENT_TYPE.CLOSE_CLIENT, { ws, request });
    });

    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-error-1
    ws.on('error', (error: Error) => {
      console.error(error);
      this.close(ws);
      this.triggerEvent(EVENT_TYPE.ERROR_CLIENT, { error, ws, request });
    });

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

  private closedConnectionDetection() {
    // 비정상 종료된 연결 감시
    const checkClients = () => {
      console.log(
        'WebSocketMiddleware > closedConnectionDetection',
        this.wss.clients.size,
      );
      this.wss.clients?.forEach((ws: any) => {
        if (ws.isAlive === false) {
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    };
    this.interval = setInterval(checkClients, 30000);
  }

  private setupSocket() {
    //console.log('WebSocketMiddleware > setupSocket');

    // 소켓 연결
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-listening
    this.wss.on('listening', () => {
      this.triggerEvent(EVENT_TYPE.LISTENING);
    });

    // 신규 클라이언트 연결
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-connection
    this.wss.on(
      'connection',
      (ws: WebSocketType, request: http.IncomingMessage) => {
        ws.isAlive = true;
        this.setupClient(ws, request);
        this.triggerUse(ws, request);
        this.triggerEvent(EVENT_TYPE.CONNECTION, { ws, request });
      },
    );

    // 연결 종료
    // https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-close
    this.wss.on('close', (code: number, reason: Buffer) => {
      console.log(EVENT_TYPE.CLOSE_SOCKET, code);
      this.interval && clearInterval(this.interval);
      this.close();
      this.triggerEvent(EVENT_TYPE.CLOSE_SOCKET, { code, reason });
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
      this.close();
      this.triggerEvent(EVENT_TYPE.ERROR_SOCKET, { error });
    });

    // 연결 감시
    this.closedConnectionDetection();
  }

  public close(ws?: WebSocket) {
    // 소켓 전체 또는 부분(ws) 연결 종료
    this.wss.clients.forEach((client: WebSocket) => {
      if (!ws || (!!ws && client === ws)) {
        client.terminate();
        client.ping();
      }
    });

    // 전체 초기화
    if (!ws) {
      this.wss.close(() => {});
      this.clear();
    }
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

  private triggerEvent(event: KeysOf<CallbackMap>, ...args: any[]) {
    const eventCallbacks = this.callbacks.get(event);
    if (eventCallbacks) {
      eventCallbacks.forEach((callback: any) => callback(...args));
    }
  }

  public clear() {
    this.callbacks.clear();
    this.routes.clear();
  }

  public use(routePath: string, handler: Function) {
    // 라우팅 설정 추가
    if (!this.routes.has(routePath)) {
      this.routes.set(routePath, new Set());
    }
    this.routes.get(routePath)?.add(handler);
  }

  private triggerUse(ws: WebSocketType, request: http.IncomingMessage) {
    const {
      complete,
      socket, // Socket
      rawHeaders,
      headers, // IncomingHttpHeaders
      method, // HTTP Method
      url, // 예: /testcase/home?test=true
      statusCode,
      statusMessage,
    } = request;

    // request 경로에 해당하는 handler 실행
    this.routes.forEach((set, routePath, map) => {
      const match = pathMatch(routePath);
      const params: boolean | { [key: string]: string | string[] | undefined } =
        match(url);

      if (!params) {
        return;
      }
      set.forEach(handler => {
        handler?.(ws, request);
      });
    });
  }
}

export default WebSocketMiddleware;
