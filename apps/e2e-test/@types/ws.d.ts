import { WebSocket as OriginalWebSocket } from 'ws';

declare module 'ws' {
  interface WebSocketType extends OriginalWebSocket {
    isAlive: boolean;
  }
}
