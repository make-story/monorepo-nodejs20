import assert from 'node:assert';
import {
  chromium,
  firefox,
  webkit,
  request,
  devices,
  errors,
  selectors,
  Browser,
  BrowserContext,
  Page,
} from 'playwright';

import { WebSocketType, RoutePayload, IncomingMessage } from '#/websocket/type';
import { messageRules } from '#/headlessbrowser/utils/index';

export default async function ({
  browser,
  context,
  page,
  ws,
  params,
  query,
}: {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  ws: WebSocketType;
  params: RoutePayload['params'];
  query: RoutePayload['query'];
}) {
  /**
   * 테스트 케이스
   */
  try {
    await context.route('**.jpg', route => route.abort());
    await page.goto('https://example.com/');
    assert((await page.title()) === 'Example Domain');
  } catch (error) {
    ws?.send(messageRules('catch', JSON.stringify(error)));
  }
}
