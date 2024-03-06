/**
 * /node_modules/@types/ws/index.d.ts
 */
import {
  Agent,
  ClientRequest,
  ClientRequestArgs,
  IncomingMessage,
  OutgoingHttpHeaders,
  Server as HTTPServer,
} from 'node:http';
import { Server as HTTPSServer } from 'node:https';
import WebSocket, { WebSocketType, WebSocketServer } from 'ws';

export {
  type WebSocketType,
  type ClientRequest,
  type IncomingMessage,
  type HTTPServer,
  type HTTPSServer,
};

// 소켓 이벤트
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

// 라우트 이벤트
export type RouteParams = { [key: string]: string | string[] | undefined };
export type RouteQuery = { [key: string]: string };
export interface RoutePayload {
  params: RouteParams;
  pathname: string;
  query: RouteQuery;
}
export type RouteHandler = (
  request: IncomingMessage,
  ws: WebSocketType,
  payload: RoutePayload,
) => any;

// interface key 리스트를 타입으로 변환
export type KeysOf<T> = {
  [K in keyof T]: K;
}[keyof T];

// interface value 리스트를 타입으로 변환
export type ValuesOf<T> = T[keyof T];
