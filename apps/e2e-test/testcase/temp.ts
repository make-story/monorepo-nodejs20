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

interface TestFunctionParams {
  browser: Browser;
  context?: BrowserContext;
  page: Page;
  ws: WebSocketType;
  params: RoutePayload['params'];
  query: RoutePayload['query'];
}
type TestFunction = ({
  browser,
  context,
  page,
  ws,
  params,
  query,
}: TestFunctionParams) => Promise<any>;

const test: TestFunction = async ({
  browser,
  context,
  page,
  ws,
  params,
  query,
}) => {
  /**
   * 테스트 케이스
   */
  try {
    await page.goto('https://stg.lotteon.com/m/product/LO2270148792');

    // element, selector 제어
    // https://playwright.dev/docs/handles#element-handles
    // https://playwright.dev/docs/handles#locator-vs-elementhandle
    // https://playwright.dev/docs/other-locators#css-locator

    // Mock API (더미API) 테스트
    // https://playwright.dev/docs/mock#mock-api-requests

    // Waiting
    // https://playwright.dev/docs/navigations#waiting-for-navigation
  } catch (error) {
    ws?.send(messageRules('catch', JSON.stringify(error)));
  }
};

export default test;
