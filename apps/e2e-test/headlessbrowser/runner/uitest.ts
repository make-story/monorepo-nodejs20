/**
 * UI Test 실행
 */
import assert from 'node:assert';
import playwright, {
  chromium,
  firefox,
  webkit,
  request,
  devices,
  errors,
  selectors,
} from 'playwright';

import { WebSocketType, RoutePayload, IncomingMessage } from '#/websocket/type';
import { loggingEvent } from '#/headlessbrowser/helper/event/logging';
import { stringToBoolean } from '#/utils/string';
import temp from '#/testcase/temp';
import { globalBrowserContext } from '#/headlessbrowser/helper/browser';
import { createChromeDevtoolsProtocol } from '#/headlessbrowser/helper/devtools';
/**
 * 테스트 케이스 실행
 */
const runner = async (
  request: IncomingMessage,
  ws: WebSocketType,
  { params, query }: RoutePayload,
) => {
  /**
   * TODO:
   * - 각각의 테스트는 new TestCase 처럼, 여러 소켓에 대응가능하도록 인스턴스 생성하여 실행 한다.
   * - 소켓이 종료 또는 이슈가 발생하면, 테스트도 중단되어야 한다.
   */
  let { device = 'mobile', testcase = 'product' } = params; // /:device/:testcase
  let { headless = true, timestamp } = query; // ?headless=true
  headless = stringToBoolean(headless);

  /**
   * 브라우저 셋업
   */
  const { browser, context } = await globalBrowserContext;
  const page = await context.newPage();

  /**
   * CDP
   */
  const client = await createChromeDevtoolsProtocol({ page });
  await client.send('Emulation.setUserAgentOverride', {
    userAgent: devices['iPhone 11'].userAgent,
  });
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: devices['iPhone 11'].viewport.width,
    height: devices['iPhone 11'].viewport.height,
    mobile: true,
    deviceScaleFactor: 0,
  });

  /**
   * 로깅전달 공통 이벤트
   */
  loggingEvent({ browser, page }, ws);

  /**
   * 테스트 케이스
   */
  temp({ browser, page, ws });

  /**
   * 종료
   */
  //await context.close();
  //await browser.close();
  ws.close();
};

export default runner;
