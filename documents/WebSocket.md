# WebSocket Server/Client

monorepo-nodejs20.git/apps/e2e-test

`MDN` 참고  
https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API

`NPM Trends` 참고  
https://npmtrends.com/socket.io-vs-websocket-vs-ws

- Socket.IO
  https://socket.io/
- SocketCluster
  https://socketcluster.io/
- WebSocket-Node
  https://github.com/theturtle32/WebSocket-Node
- `ws`
  https://github.com/websockets/ws

https://github.com/theturtle32/WebSocket-Node

https://www.pubnub.com/blog/nodejs-websocket-programming-examples/

https://medium.com/@PubNub/node-js-websocket-programming-examples-f6b8e15f8f85

```bash
$ yarn add ws @types/ws
```

### Node.js 21 버전 - WebSocket 내장

https://nodejs.org/en/blog/announcements/v21-release-announce#built-in-websocket-client

https://github.com/nodejs/undici/tree/main/test/websocket

https://www.nearform.com/insights/whats-new-in-node-js-21/

```javascript
// example.js
const ws = new WebSocket('wss://echo.websocket.events/');

ws.addEventListener('message', event => {
  console.log('received:', event.data); // "echo.websocket.events sponsored by Lob.com"
});

ws.addEventListener('open', () => {
  let i = 0;
  setInterval(() => {
    const text = `hello. This is message number #${i}`;
    console.log('sending:', text);
    ws.send(text);
    i++;
  }, 1000);
});
```

```
$ node --experimental-websocket example.js
```
