/**
 * UI Test 실행
 * CLI, GUI(websocket 호출) 사용
 */
import assert from 'node:assert';
import {
  chromium,
  firefox,
  webkit,
  request,
  devices,
  errors,
  selectors,
} from 'playwright';

import { loggingEvent } from '#/headlessbrowser/helper/event/logging';
import {
  BROWSER_TYPE,
  createBrowserContext,
} from '#/headlessbrowser/helper/browser';
import { createChromeDevtoolsProtocol } from '#/headlessbrowser/helper/devtools';
import { RouteHandler } from '#/websocket/type';
import { stringToBoolean } from '#/utils/string';
import { getDirectoryFile } from '#/utils/fileSystem';

const runner: RouteHandler = async ({
  request,
  ws,
  params = {},
  query = {},
}) => {
  /**
   * TODO:
   * - 각각의 테스트는 new TestCase 처럼, 여러 소켓에 대응가능하도록 인스턴스 생성하여 실행 한다.
   * - 소켓이 종료 또는 이슈가 발생하면, 테스트도 중단되어야 한다.
   */
  let {
    device: deviceType = 'mobile',
    category: categoryType = 'product',
    testcase: testcaseType,
  } = params; // /:device/:category/:testcase
  let { browser: browserType, headless = true, timestamp } = query; // ?headless=true
  const { file: testcaseList } = getDirectoryFile(
    `headlessbrowser/testcase/${categoryType}`,
    {
      isFileExtension: false,
    },
  );

  /**
   * 유효성 확인
   */
  if (!testcaseType || !testcaseList.includes(testcaseType as string)) {
    if (ws) {
      ws?.close();
    } else {
      console.warn('테스트케이스 없습니다!');
    }
    return;
  }
  if (
    !browserType ||
    !Object.values(BROWSER_TYPE).includes(browserType as any)
  ) {
    browserType = BROWSER_TYPE.CHROMIUM;
  }
  headless = stringToBoolean(headless);
  if (typeof headless !== 'boolean') {
    headless = false;
  }

  let browser, context;
  try {
    /**
     * 브라우저 셋업
     */
    ({ browser, context } = await createBrowserContext({
      browserType:
        browserType as (typeof BROWSER_TYPE)[keyof typeof BROWSER_TYPE],
      headless,
      devtools: true,
    }));
    if (!browser || !context) {
      return;
    }
    const page = await context.newPage();

    /**
     * CDP
     */
    if (browserType === BROWSER_TYPE.CHROMIUM) {
      const client = await createChromeDevtoolsProtocol({ page });
      if (deviceType === 'mobile') {
        await client.send('Emulation.setUserAgentOverride', {
          userAgent: devices['iPhone 11'].userAgent,
        });
        await client.send('Emulation.setDeviceMetricsOverride', {
          width: devices['iPhone 11'].viewport.width,
          height: devices['iPhone 11'].viewport.height,
          mobile: true,
          deviceScaleFactor: 0,
        });
      }
    }

    /**
     * 로깅전달 공통 이벤트
     */
    ws && loggingEvent({ browser, page, ws });

    /**
     * 테스트 케이스
     */
    const { default: testcase } = await import(
      `../testcase/${categoryType}/${testcaseType}`
    );
    await testcase({ browser, page, ws });
  } catch (error) {
    console.error(error);
  } finally {
    /**
     * 종료
     */
    context && (await context.close());
    browser && (await browser.close());
    ws?.close();
  }
};

export default runner;
