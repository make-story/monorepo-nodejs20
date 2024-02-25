import WebSocket, { WebSocketType, WebSocketServer } from 'ws';

export { type WebSocketType };

export interface MiddlewareOptions {}
export type ListeningCallback = () => void;
export type MessageCallback = () => void;
export type ConnectionCallback = () => void;
export type CloseCallback = () => void;
export type SocketErrorCallback = () => void;

export interface CallbackMap {
  listening?: ListeningCallback;
  connection?: ConnectionCallback;
  open?: ConnectionCallback;
  message?: MessageCallback;
  closeSocket?: CloseCallback;
  closeClient?: CloseCallback;
  errorSocket?: SocketErrorCallback;
  errorClient?: SocketErrorCallback;
}

// interface key 리스트를 타입으로 변환
export type KeysOf<T> = {
  [K in keyof T]: K;
}[keyof T];

// interface value 리스트를 타입으로 변환
export type ValuesOf<T> = T[keyof T];
