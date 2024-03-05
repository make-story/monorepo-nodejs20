/**
 * UI Test 실행
 */
import * as http from 'node:http';
import { chromium, firefox, webkit, devices } from 'playwright';
import assert from 'node:assert';

import { WebSocketType } from '#/websocket/type';
import { loggingEvent } from '#/headlessbrowser/helper/event';
import { messageRules } from '#/headlessbrowser/utils/index';

const running = async (request: http.IncomingMessage, ws: WebSocketType) => {
  /**
   * TODO:
   * - 각각의 테스트는 new TestCase 처럼, 여러 소켓에 대응가능하도록 인스턴스 생성하여 실행 한다.
   * - 소켓이 종료 또는 이슈가 발생하면, 테스트도 중단되어야 한다.
   */

  /**
   * 브라우저 셋업
   */
  const browser = await chromium.launch();
  // https://playwright.dev/docs/api/class-browser#browser-new-context
  const context = await browser.newContext({
    ...devices['iPhone 11'],
  });
  // https://playwright.dev/docs/api/class-browser#browser-new-page
  const page = await context.newPage();

  /**
   * 로깅전달 공통 이벤트
   */
  loggingEvent({ page }, ws);

  /**
   * 테스트 케이스
   */
  try {
    await context.route('**.jpg', route => route.abort());
    await page.goto('https://example.com/');
    assert((await page.title()) === 'Example Domain'); // 👎 not a Web First assertion
  } catch (error) {
    ws?.send(messageRules('catch', JSON.stringify(error)));
  }

  /**
   * 종료
   */
  await context.close();
  await browser.close();
  ws.close();
};

export { running };
