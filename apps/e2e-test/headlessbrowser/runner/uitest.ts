/**
 * UI Test 실행
 * CLI, GUI(websocket 호출) 사용
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

import { loggingEvent } from '#/headlessbrowser/helper/event/logging';
import {
  createBrowserContext,
  globalBrowserContext,
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
    group: groupType,
    testcase: testcaseType,
  } = params; // /:device/:group/:testcase
  let { browser: browserType = 'chromium', headless = true, timestamp } = query; // ?headless=true
  const { file: testcaseList } = getDirectoryFile(
    'headlessbrowser/testcase/group/product',
    {
      isFileExtension: false,
    },
  );
  headless = stringToBoolean(headless);

  // 유효성 확인
  if (!testcaseType || !testcaseList.includes(testcaseType as string)) {
    if (ws) {
      ws?.close();
    } else {
      console.warn('테스트케이스 없습니다!');
    }
    return;
  }
  if (!browserType || !['chromium', 'webkit'].includes(browserType)) {
    browserType = 'chromium';
  }
  if (typeof headless !== 'boolean') {
    headless = false; // TODO: 수정필요!
  }

  try {
    /**
     * 브라우저 셋업
     */
    const { browser, context } = await globalBrowserContext;
    /*const { browser, context } = await createBrowserContext({
      browserType: (browserType as 'chromium', 'webkit'),
      headless,
      devtools: !headless,
    });*/
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
    ws && loggingEvent({ browser, page, ws });

    /**
     * 테스트 케이스
     */
    const { default: testcase } = await import(
      `../testcase/group/product/${testcaseType}`
    );
    await testcase({ browser, page, ws });
  } catch (error) {
    console.error(error);
  } finally {
    /**
     * 종료
     */
    //await context.close();
    //await browser.close();
    ws?.close();
  }
};

export default runner;
