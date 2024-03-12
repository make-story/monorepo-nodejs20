import { Browser, BrowserContext, Page } from 'playwright';

import { WebSocketType, RoutePayload, IncomingMessage } from '#/websocket/type';

export interface TestCaseFunctionParams {
  browser: Browser;
  context?: BrowserContext;
  page: Page;
  ws?: WebSocketType; // cli 에서도 실행할 수 있기 때문에, ws 는 선택적 값
  params?: RoutePayload['params'];
  query?: RoutePayload['query'];
}
export type TestCaseFunction = ({
  browser,
  context,
  page,
  ws,
  params,
  query,
}: TestCaseFunctionParams) => Promise<any>;
