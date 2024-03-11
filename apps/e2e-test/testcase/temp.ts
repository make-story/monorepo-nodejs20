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
  ws?: WebSocketType; // cli 에서도 실행할 수 있기 때문에, ws 는 선택적 값
  params?: RoutePayload['params'];
  query?: RoutePayload['query'];
}
type TestFunction = ({
  browser,
  context,
  page,
  ws,
  params,
  query,
}: TestFunctionParams) => Promise<any>;

const temp: TestFunction = async ({
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
    // https://playwright.dev/docs/test-timeouts
    await page.goto('https://stg.lotteon.com/m/product/LO2270148792', {
      timeout: 30000,
    });
    // https://playwright.dev/dotnet/docs/api/class-page#page-wait-for-load-state
    // https://playwright.dev/docs/api/class-page#page-wait-for-load-state
    await page.waitForLoadState();

    // element, selector 제어
    // https://playwright.dev/docs/handles#element-handles
    // https://playwright.dev/docs/handles#locator-vs-elementhandle
    // https://playwright.dev/docs/other-locators#css-locator
    if (await page.locator('.popContents').isVisible()) {
      await page.locator('.btnNoProblem').click();
    }

    // 상품이미지 로드 대기
    const locator = await page.locator('#innerImgClickDisable').boundingBox();
    const center = {
      x: locator!.x + locator!.width / 2,
      y: locator!.y + locator!.height / 2,
    };
    console.log(center);
    await page.mouse.move(50, 50);
    await page.mouse.down();
    await page.mouse.move(50 - 1000, 50);
    await page.mouse.up();

    // Mock API (더미API) 테스트
    // https://playwright.dev/docs/mock#mock-api-requests

    // Waiting
    // https://playwright.dev/docs/navigations#waiting-for-navigation
  } catch (error) {
    ws?.send(messageRules('catch', JSON.stringify(error)));
  }
};

export default temp;
